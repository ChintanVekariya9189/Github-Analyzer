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
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Monthly Commit History
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Contributions across the last 12 months
        </p>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
              className="dark:stroke-gray-800"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-xl text-sm">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {payload[0].payload.month}
                      </p>
                      <p className="text-indigo-500 font-medium">
                        {payload[0].value} contributions
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  className="fill-indigo-500 hover:fill-indigo-600 transition-colors duration-200"
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
