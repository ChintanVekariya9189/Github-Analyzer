import { ActivityCalendar } from 'react-activity-calendar';
import type { HeatmapData } from '../types/github';
import 'react-activity-calendar/tooltips.css';

interface ContributionGraphProps {
  data: HeatmapData[];
  loading?: boolean;
}

const ContributionGraph = ({ data, loading }: ContributionGraphProps) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 h-[200px] flex items-center justify-center animate-pulse">
        <div className="text-gray-400">Loading contribution data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 overflow-x-auto">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Contribution Heatmap
      </h3>
      <div className="min-w-[700px]">
        <ActivityCalendar
          data={data}
          theme={{
            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
            dark: ['#161b22', '#01311f', '#034525', '#24a742', '#3ad353'],
          }}
          labels={{
            totalCount: '{{count}} contributions in the last year',
          }}
          tooltips={{
            activity: {
              text: (activity: any) =>
                `${activity.count} contributions on ${activity.date}`,
            },
          }}
        />
      </div>
    </div>
  );
};

export default ContributionGraph;
