import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, BarChart3, RefreshCw, Sparkles } from "lucide-react";
import { aiTeamSummaryRequest } from "../../api/ai.api";
import { Modal } from "../ui/Modal";
import { ErrorState, Spinner } from "../ui/Primitives";
import { Button } from "../ui/Button";


interface TeamSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: { week?: string; projectId?: string };
}

const SECTION_CONFIG = [
  { key: "Completed Work", icon: CheckCircle2, color: "text-status-submitted", bg: "bg-status-submittedBg" },
  { key: "Recurring Blockers", icon: AlertTriangle, color: "text-status-late", bg: "bg-status-lateBg" },
  { key: "Workload Balance", icon: BarChart3, color: "text-brand-700", bg: "bg-brand-50" },
];

/** Splits the AI's plain-text reply into the three fixed sections the backend prompt asks for. */
function parseSections(text: string) {
  const headerNames = SECTION_CONFIG.map((s) => s.key);
  const pattern = new RegExp(`(${headerNames.join("|")})`, "gi");
  const parts = text.split(pattern).map((p) => p.trim()).filter(Boolean);

  const sections: { title: string; lines: string[] }[] = [];
  for (let i = 0; i < parts.length; i++) {
    const match = headerNames.find((h) => h.toLowerCase() === parts[i].toLowerCase());
    if (match) {
      const content = parts[i + 1] || "";
      const lines = content
        .split("\n")
        .map((l) => l.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean);
      sections.push({ title: match, lines });
      i++;
    }
  }

  // Fall back to showing the raw reply if the model didn't use the expected headings
  return sections.length > 0 ? sections : [{ title: "Summary", lines: [text] }];
}

export const TeamSummaryModal = ({ isOpen, onClose, filters }: TeamSummaryModalProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [reportsUsed, setReportsUsed] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await aiTeamSummaryRequest(filters);
      setSummary(data.data.summary);
      setReportsUsed(data.data.reportsUsed);
    } catch (err: unknown) {
      const isApiError = (e: unknown): e is { response?: { data?: { message?: string } } } =>
        typeof e === "object" && e !== null && "response" in e;

      if (isApiError(err)) {
        setError(err.response?.data?.message || "Could not generate the summary");
      } else {
        setError("Could not generate the summary");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate the first time the modal opens; not on every filter change,
  // so switching week/project elsewhere doesn't silently burn API calls.
  useEffect(() => {
    if (isOpen && summary === null && !isLoading) {
      // Avoid calling setState synchronously inside an effect - schedule async
      void Promise.resolve().then(generate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const sections = summary ? parseSections(summary) : [];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="AI team summary" maxWidth="max-w-2xl">
      <div className="flex max-h-[70vh] flex-col">
        {/* Scrollable content region — header/footer stay put, only this area scrolls */}
        <div className="-mr-2 flex-1 space-y-4 overflow-y-auto pr-2">
          {isLoading && <Spinner />}
          {error && <ErrorState message={error} />}

          {!isLoading && !error && summary && (
            <div className="space-y-3">
              {sections.map((section) => {
                const config = SECTION_CONFIG.find((s) => s.key === section.title);
                const Icon = config?.icon ?? Sparkles;
                return (
                  <div key={section.title} className={`rounded-lg p-4 ${config?.bg ?? "bg-surface-sunken"}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${config?.color ?? "text-ink-soft"}`} />
                      <h4 className="font-display text-sm font-semibold text-ink">
                        {section.title}
                      </h4>
                    </div>
                    {section.lines.length === 0 ? (
                      <p className="text-sm text-ink-soft">Nothing notable this period</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {section.lines.map((line, i) => (
                          <li key={i} className="text-sm text-ink-soft">
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer stays pinned below the scroll area */}
        {!isLoading && !error && summary && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <p className="text-xs text-ink-soft">
              Based on {reportsUsed} {reportsUsed === 1 ? "report" : "reports"}
            </p>
            <Button size="sm" variant="secondary" onClick={generate} isLoading={isLoading}>
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};