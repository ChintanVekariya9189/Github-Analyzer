import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { aggregateMonthlyCommits } from '../utils/statsUtils';
import type { HeatmapData } from '../types/github';

interface MonthlyCommitsChartProps {
  contributions: HeatmapData[];
}

const MonthlyCommitsChart = ({ contributions }: MonthlyCommitsChartProps) => {
  const data = aggregateMonthlyCommits(contributions);

  if (data.length === 0) return null;

  return (
    <div className="flex flex-col h-full min-h-[300px]">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#f0f6fc]">
          Monthly Activity
        </h3>
        <p className="text-xs text-[#8b949e] mt-1">
          Contributions across the last 12 months
        </p>
      </div>

      <div className="flex-1 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#30363d"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8b949e', fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8b949e', fontSize: 10 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 shadow-2xl text-xs">
                      <p className="font-bold text-[#f0f6fc]">
                        {payload[0].payload.month}
                      </p>
                      <p className="text-[#238636] font-medium mt-1">
                        {payload[0].value} contributions
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]} barSize={24}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  className="fill-[#238636] hover:fill-[#2ea043] transition-colors duration-200"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyCommitsChart;
