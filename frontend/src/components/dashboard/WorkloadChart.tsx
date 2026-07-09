import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import type { WorkloadRow } from "../../types";
import { Card, CardHeader, EmptyState } from "../ui/Primitives";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

const BAR_COLORS = ["#0F766E", "#14B8A6", "#5EEAD4", "#99F6E4", "#0D9488", "#2DD4BF"];

export const WorkloadChart = ({ workload }: { workload: WorkloadRow[] }) => {
  return (
    <Card>
      <CardHeader title="Workload by project" subtitle="Report count per project in range" />
      {workload.length === 0 ? (
        <EmptyState title="No reports in this range yet" />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={workload} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="projectName"
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
              contentStyle={{
                borderRadius: 10,
                borderColor: "#E2E8F0",
                fontSize: 13,
              }}
              formatter={(value: ValueType, name: NameType | undefined) => [
                Number(value ?? 0),
                name === "reportCount" ? "Reports" : "Total hours",
              ]}
            />
            <Bar dataKey="reportCount" radius={[6, 6, 0, 0]}>
              {workload.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
