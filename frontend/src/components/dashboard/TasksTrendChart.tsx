import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, EmptyState } from "../ui/Primitives";
import type { TrendPoint } from "../../types";


const formatWeekLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const TasksTrendChart = ({ trend }: { trend: TrendPoint[] }) => {
  const hasData = trend.some((t) => t.total > 0);

  return (
    <Card>
      <CardHeader title="Tasks trend" subtitle="Report volume over recent weeks" />
      {!hasData ? (
        <EmptyState title="No report activity in this range yet" />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trend} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="week"
              tickFormatter={formatWeekLabel}
              tick={{ fontSize: 12, fill: "#5B6472" }}
              axisLine={{ stroke: "#E2E8F0" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#5B6472" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              labelFormatter={(v) => `Week of ${formatWeekLabel(v as string)}`}
              contentStyle={{ borderRadius: 10, borderColor: "#E2E8F0", fontSize: 13 }}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Reports logged"
              stroke="#5EEAD4"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="reportsSubmitted"
              name="Reports submitted"
              stroke="#0F766E"
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
