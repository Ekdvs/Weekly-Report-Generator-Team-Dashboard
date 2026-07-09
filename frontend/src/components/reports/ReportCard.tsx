import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import type { Report } from "../../types";
import { Card, StatusBadge } from "../ui/Primitives";
import { formatWeekRange } from "../../lib/utils";


export const ReportCard = ({ report }: { report: Report }) => {
  const projectName = "name" in report.project ? report.project.name : "";

  return (
    <Link to={`/reports/${report.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              {formatWeekRange(report.weekStart, report.weekEnd)}
            </p>
            <p className="mt-0.5 text-sm text-ink-soft">{projectName}</p>
          </div>
          <StatusBadge status={report.status} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-ink-soft">{report.tasksCompleted}</p>

        <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {report.hoursWorked ? `${report.hoursWorked}h logged` : "Hours not logged"}
          </div>
          <span className="flex items-center gap-1 font-medium text-brand-700">
            View <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
};
