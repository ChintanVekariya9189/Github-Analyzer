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
      <div className="h-[150px] flex items-center justify-center animate-pulse">
        <div className="text-[#8b949e]">Loading contribution data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <ActivityCalendar
          data={data}
          theme={{
            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
          }}
          labels={{
            totalCount: '{{count}} contributions in the last year',
          }}
          colorScheme="dark"
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
