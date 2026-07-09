import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { aiChatRequest } from "../../api/ai.api";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";


interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ask me about the team's week — e.g. \"What did the design team work on?\" or \"Any recurring blockers?\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  const send = async () => {
    const message = input.trim();
    if (!message || isSending) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setIsSending(true);

    try {
      const { data } = await aiChatRequest({ message });
      setMessages((prev) => [...prev, { role: "assistant", content: data.data.reply }]);
    } catch (err: unknown) {
      const errorMessage =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage || "Something went wrong reaching the assistant.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[28rem] w-96 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 bg-nav px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-4 w-4 text-brand-300" />
              <span className="font-display text-sm font-semibold">Team assistant</span>
            </div>
            <Button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-brand-700 text-white"
                    : "bg-surface-sunken text-ink"
                )}
              >
                {m.content}
              </div>
            ))}
            {isSending && (
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Reviewing this week's reports…
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-slate-100 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about the team's week…"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
            />
            <button
              onClick={send}
              disabled={isSending || !input.trim()}
              className="rounded-lg bg-brand-700 p-2 text-white hover:bg-brand-600 disabled:opacity-40 bg-blue-600"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white shadow-xl transition-transform hover:scale-105 bg-blue-600"
        aria-label="Open team assistant"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    </>
  );
};
