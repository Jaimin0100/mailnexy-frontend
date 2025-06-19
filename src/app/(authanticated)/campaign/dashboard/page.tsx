"use client";
import { useState, useEffect } from "react";
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  ArcElement,
  Tooltip,
} from 'chart.js';
import TotalEmailSentIcon from '@/components/icons/TotalEmailSentIcon';
import OpenRateIcon from '@/components/icons/OpenRateIcon';
import ClickRateIcon from '@/components/icons/ClickRateIcon';
import ReplyRateIcon from '@/components/icons/ReplyRateIcon';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, ArcElement, Tooltip);

// Define types
type TimeFrame = 'Hour' | 'Day' | 'Week' | 'Month';

type StatData = {
  [key in TimeFrame]?: {
    labels?: string[];
    data?: number[];
    total?: number;
    percentage?: number;
  };
};

type Stats = {
  totalEmailSent: StatData;
  openRate: StatData;
  clickRate: StatData;
  replyRate: StatData;
};

type Metrics = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
};

type StatusBreakdown = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
    borderColor: string;
    cutout: string;
  }[];
};

type RecentCampaign = {
  name: string;
  sent: number;
  openRate: number;
  clickRate: number;
};

type CardProps = {
  title: string;
  icon: React.ReactNode;
  total: number;
  percentage: number;
  timeFrame: TimeFrame;
  setTimeFrame: (value: TimeFrame) => void;
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
      borderWidth: number;
      pointRadius: number;
      pointHoverRadius: number;
    }[];
  };
};

// Card component
function Card({ title, icon, total, percentage, timeFrame, setTimeFrame, chartData }: CardProps) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl w-full max-w-[300px] h-[120px] border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-[#EAEDFD] bg-opacity-50 p-2 rounded-[8px]">{icon}</div>
          <h1 className="text-xs text-gray-600 font-bold tracking-wide">{title}</h1>
        </div>
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
          className="text-xs text-gray-500 bg-transparent border-none focus:outline-none"
        >
          <option value="Hour">Hour</option>
          <option value="Day">Day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
        </select>
      </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-3xl text-gray-800 font-semibold">{total}</p>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-green-500 font-medium">
            {percentage}% vs last {timeFrame.toLowerCase()}
          </span>
        </div>
      </div>
      <div className="h-12 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('Week');
  const [stats, setStats] = useState<Stats>({
    totalEmailSent: {},
    openRate: {},
    clickRate: {},
    replyRate: {},
  });
  const [metrics, setMetrics] = useState<Metrics>({ labels: [], datasets: [] });
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown>({
    labels: ['Delivered', 'Bounced', 'Unsubscribed'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#3B82F6', '#EF4444', '#D1D5DB'],
        borderWidth: 0,
        borderColor: '#FFFFFF',
        cutout: '60%',
      },
    ],
  });
  const [recentCampaigns, setRecentCampaigns] = useState<RecentCampaign[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsResponse = await fetch('http://localhost:5000/api/v1/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!statsResponse.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch metrics and status breakdown
        const metricsResponse = await fetch('http://localhost:5000/api/v1/dashboard/metrics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!metricsResponse.ok) throw new Error('Failed to fetch metrics');
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData.metrics);
        // Update statusBreakdown only if data is available, otherwise keep default
        if (metricsData.statusBreakdown && metricsData.statusBreakdown.datasets[0].data.some((val: number) => val > 0)) {
          setStatusBreakdown(metricsData.statusBreakdown);
        }

        // Fetch recent campaigns
        const campaignsResponse = await fetch('http://localhost:5000/api/v1/dashboard/recent-campaigns', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!campaignsResponse.ok) throw new Error('Failed to fetch recent campaigns');
        const campaignsData = await campaignsResponse.json();
        setRecentCampaigns(campaignsData.recentCampaigns);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  const chartData = (metric: keyof Stats) => ({
    labels: stats[metric][timeFrame]?.labels || [],
    datasets: [
      {
        label: metric,
        data: stats[metric][timeFrame]?.data || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  });

  const emailsSentOverTimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { size: 14 } },
      },
      y: {
        grid: { borderDash: [5, 5], color: '#E5E7EB' },
        ticks: { stepSize: 500, color: '#6B7280', font: { size: 14 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        padding: 10,
        cornerRadius: 4,
      },
    },
  };

  const emailStatusBreakdownOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return value > 0 ? `${label}: ${value}` : `${label}: No data`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    // Ensure the chart is visible even with zero data
    cutout: '60%',
    circumference: 360,
    rotation: 0,
  };

  const icons = {
    totalEmailSent: <TotalEmailSentIcon />,
    openRate: <OpenRateIcon />,
    clickRate: <ClickRateIcon />,
    replyRate: <ReplyRateIcon />,
  };

  // Custom legend for donut chart
  const donutChartLegend = (
    <div className="absolute bottom-4 left-4 flex space-x-4">
      {statusBreakdown.labels.map((label, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: statusBreakdown.datasets[0].backgroundColor[index] }}
          ></div>
          <span className="text-sm text-gray-600">{label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            title="Total Email Sent"
            icon={icons.totalEmailSent}
            total={stats.totalEmailSent[timeFrame]?.total || 0}
            percentage={stats.totalEmailSent[timeFrame]?.percentage || 0}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            chartData={chartData('totalEmailSent')}
          />
          <Card
            title="Open Rate"
            icon={icons.openRate}
            total={stats.openRate[timeFrame]?.total || 0}
            percentage={stats.openRate[timeFrame]?.percentage || 0}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            chartData={chartData('openRate')}
          />
          <Card
            title="Click Rate"
            icon={icons.clickRate}
            total={stats.clickRate[timeFrame]?.total || 0}
            percentage={stats.clickRate[timeFrame]?.percentage || 0}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            chartData={chartData('clickRate')}
          />
          <Card
            title="Reply Rate"
            icon={icons.replyRate}
            total={stats.replyRate[timeFrame]?.total || 0}
            percentage={stats.replyRate[timeFrame]?.percentage || 0}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            chartData={chartData('replyRate')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white pb-10 pt-6 pl-6 pr-6 rounded-xl border border-gray-200 relative">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Email Metrics Over Time</h2>
            <div className="absolute bottom-4 left-4 flex space-x-4">
              {metrics.datasets.map((dataset, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: dataset.borderColor }}
                  ></div>
                  <span className="text-sm text-gray-600">{dataset.label}</span>
                </div>
              ))}
            </div>
            <div className="h-[240px]">
              <Line data={metrics} options={emailsSentOverTimeOptions} />
            </div>
          </div>

          <div className="lg:col-span-1 bg-white pb-10 pt-6 pl-6 pr-6 rounded-xl border border-gray-200 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800">Email Status Breakdown</h2>
              <select className="text-xs text-gray-500 bg-transparent border-none focus:outline-none">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            {donutChartLegend}
            <div className="h-[220px]">
              <Doughnut data={statusBreakdown} options={emailStatusBreakdownOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Campaigns</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 text-gray-600 font-medium">Campaign Name</th>
                <th className="py-3 text-gray-600 font-medium">Emails Sent</th>
                <th className="py-3 text-gray-600 font-medium">Open Rate</th>
                <th className="py-3 text-gray-600 font-medium">Click Rate</th>
              </tr>
            </thead>
            <tbody>
              {recentCampaigns.map((campaign, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 text-gray-700">{campaign.name}</td>
                  <td className="py-3 text-gray-700">{campaign.sent}</td>
                  <td className="py-3 text-gray-700">{campaign.openRate}%</td>
                  <td className="py-3 text-gray-700">{campaign.clickRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}









// "use client";
// import { useState, useEffect } from "react";
// import { Line, Doughnut } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Filler,
//   ArcElement,
//   Tooltip,
// } from 'chart.js';
// import TotalEmailSentIcon from '@/components/icons/TotalEmailSentIcon';
// import OpenRateIcon from '@/components/icons/OpenRateIcon';
// import ClickRateIcon from '@/components/icons/ClickRateIcon';
// import ReplyRateIcon from '@/components/icons/ReplyRateIcon';

// ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, ArcElement, Tooltip);

// // Card component
// function Card({ title, icon, total, percentage, timeFrame, setTimeFrame, chartData }) {
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: { display: false },
//       y: { display: false },
//     },
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: true,
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         titleFont: { size: 12 },
//         bodyFont: { size: 12 },
//         padding: 10,
//         cornerRadius: 4,
//       },
//     },
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl w-full max-w-[300px] h-[120px] border border-gray-200">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-3">
//           <div className="bg-[#EAEDFD] bg-opacity-50 p-2 rounded-[8px]">{icon}</div>
//           <h1 className="text-xs text-gray-600 font-bold tracking-wide">{title}</h1>
//         </div>
//         <select
//           value={timeFrame}
//           onChange={(e) => setTimeFrame(e.target.value)}
//           className="text-xs text-gray-500 bg-transparent border-none focus:outline-none"
//         >
//           <option value="Hour">Hour</option>
//           <option value="Day">Day</option>
//           <option value="Week">Week</option>
//           <option value="Month">Month</option>
//         </select>
//       </div>
//       <div className="flex items-center justify-between mb-4">
//         <p className="text-3xl text-gray-800 font-semibold">{total}</p>
//         <div className="flex items-center space-x-1">
//           <span className="text-xs text-green-500 font-medium">
//             {percentage}% vs last {timeFrame.toLowerCase()}
//           </span>
//         </div>
//       </div>
//       <div className="h-12 w-full">
//         <Line data={chartData} options={chartOptions} />
//       </div>
//     </div>
//   );
// }

// export default function DashboardPage() {
//   const [timeFrame, setTimeFrame] = useState('Week');
//   const [stats, setStats] = useState({
//     totalEmailSent: {},
//     openRate: {},
//     clickRate: {},
//     replyRate: {},
//   });
//   const [metrics, setMetrics] = useState({ labels: [], datasets: [] });
//   const [statusBreakdown, setStatusBreakdown] = useState({
//     labels: ['Delivered', 'Bounced', 'Unsubscribed'],
//     datasets: [
//       {
//         data: [0, 0, 0],
//         backgroundColor: ['#3B82F6', '#EF4444', '#D1D5DB'],
//         borderWidth: 0,
//         borderColor: '#FFFFFF',
//         cutout: '60%',
//       },
//     ],
//   });
//   const [recentCampaigns, setRecentCampaigns] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch stats
//         const statsResponse = await fetch('http://localhost:5000/api/v1/dashboard/stats', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         if (!statsResponse.ok) throw new Error('Failed to fetch stats');
//         const statsData = await statsResponse.json();
//         setStats(statsData);

//         // Fetch metrics and status breakdown
//         const metricsResponse = await fetch('http://localhost:5000/api/v1/dashboard/metrics', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         if (!metricsResponse.ok) throw new Error('Failed to fetch metrics');
//         const metricsData = await metricsResponse.json();
//         setMetrics(metricsData.metrics);
//         // Update statusBreakdown only if data is available, otherwise keep default
//         if (metricsData.statusBreakdown && metricsData.statusBreakdown.datasets[0].data.some(val => val > 0)) {
//           setStatusBreakdown(metricsData.statusBreakdown);
//         }

//         // Fetch recent campaigns
//         const campaignsResponse = await fetch('http://localhost:5000/api/v1/dashboard/recent-campaigns', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         if (!campaignsResponse.ok) throw new Error('Failed to fetch recent campaigns');
//         const campaignsData = await campaignsResponse.json();
//         setRecentCampaigns(campaignsData.recentCampaigns);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   const chartData = (metric) => ({
//     labels: stats[metric][timeFrame]?.labels || [],
//     datasets: [
//       {
//         label: metric,
//         data: stats[metric][timeFrame]?.data || [],
//         borderColor: '#10B981',
//         backgroundColor: 'rgba(16, 185, 129, 0.1)',
//         fill: true,
//         tension: 0.4,
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 0,
//       },
//     ],
//   });

//   const emailsSentOverTimeOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         grid: { display: false },
//         ticks: { color: '#6B7280', font: { size: 14 } },
//       },
//       y: {
//         grid: { borderDash: [5, 5], color: '#E5E7EB' },
//         ticks: { stepSize: 500, color: '#6B7280', font: { size: 14 } },
//       },
//     },
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: true,
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         titleFont: { size: 14 },
//         bodyFont: { size: 14 },
//         padding: 10,
//         cornerRadius: 4,
//       },
//     },
//   };

//   const emailStatusBreakdownOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: true,
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         titleFont: { size: 12 },
//         bodyFont: { size: 12 },
//         padding: 10,
//         cornerRadius: 4,
//         callbacks: {
//           label: function (context) {
//             const label = context.label || '';
//             const value = context.raw || 0;
//             return value > 0 ? `${label}: ${value}` : `${label}: No data`;
//           },
//         },
//       },
//     },
//     elements: {
//       arc: {
//         borderWidth: 0,
//       },
//     },
//     // Ensure the chart is visible even with zero data
//     cutout: '60%',
//     circumference: 360,
//     rotation: 0,
//   };

//   const icons = {
//     totalEmailSent: <TotalEmailSentIcon />,
//     openRate: <OpenRateIcon />,
//     clickRate: <ClickRateIcon />,
//     replyRate: <ReplyRateIcon />,
//   };

//   // Custom legend for donut chart
//   const donutChartLegend = (
//     <div className="absolute bottom-4 left-4 flex space-x-4">
//       {statusBreakdown.labels.map((label, index) => (
//         <div key={index} className="flex items-center space-x-2">
//           <div
//             className="w-4 h-4 rounded"
//             style={{ backgroundColor: statusBreakdown.datasets[0].backgroundColor[index] }}
//           ></div>
//           <span className="text-sm text-gray-600">{label}</span>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 pt-10">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card
//             title="Total Email Sent"
//             icon={icons.totalEmailSent}
//             total={stats.totalEmailSent[timeFrame]?.total || 0}
//             percentage={stats.totalEmailSent[timeFrame]?.percentage || 0}
//             timeFrame={timeFrame}
//             setTimeFrame={setTimeFrame}
//             chartData={chartData('totalEmailSent')}
//           />
//           <Card
//             title="Open Rate"
//             icon={icons.openRate}
//             total={stats.openRate[timeFrame]?.total || 0}
//             percentage={stats.openRate[timeFrame]?.percentage || 0}
//             timeFrame={timeFrame}
//             setTimeFrame={setTimeFrame}
//             chartData={chartData('openRate')}
//           />
//           <Card
//             title="Click Rate"
//             icon={icons.clickRate}
//             total={stats.clickRate[timeFrame]?.total || 0}
//             percentage={stats.clickRate[timeFrame]?.percentage || 0}
//             timeFrame={timeFrame}
//             setTimeFrame={setTimeFrame}
//             chartData={chartData('clickRate')}
//           />
//           <Card
//             title="Reply Rate"
//             icon={icons.replyRate}
//             total={stats.replyRate[timeFrame]?.total || 0}
//             percentage={stats.replyRate[timeFrame]?.percentage || 0}
//             timeFrame={timeFrame}
//             setTimeFrame={setTimeFrame}
//             chartData={chartData('replyRate')}
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           <div className="lg:col-span-2 bg-white pb-10 pt-6 pl-6 pr-6 rounded-xl border border-gray-200 relative">
//             <h2 className="text-lg font-medium text-gray-800 mb-4">Email Metrics Over Time</h2>
//             <div className="absolute bottom-4 left-4 flex space-x-4">
//               {metrics.datasets.map((dataset, index) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <div
//                     className="w-4 h-4 rounded"
//                     style={{ backgroundColor: dataset.borderColor }}
//                   ></div>
//                   <span className="text-sm text-gray-600">{dataset.label}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="h-[240px]">
//               <Line data={metrics} options={emailsSentOverTimeOptions} />
//             </div>
//           </div>

//           <div className="lg:col-span-1 bg-white pb-10 pt-6 pl-6 pr-6 rounded-xl border border-gray-200 relative">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-medium text-gray-800">Email Status Breakdown</h2>
//               <select className="text-xs text-gray-500 bg-transparent border-none focus:outline-none">
//                 <option>This Week</option>
//                 <option>This Month</option>
//               </select>
//             </div>
//             {donutChartLegend}
//             <div className="h-[220px]">
//               <Doughnut data={statusBreakdown} options={emailStatusBreakdownOptions} />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border border-gray-200">
//           <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Campaigns</h2>
//           <table className="w-full text-left text-sm">
//             <thead>
//               <tr className="border-b border-gray-100">
//                 <th className="py-3 text-gray-600 font-medium">Campaign Name</th>
//                 <th className="py-3 text-gray-600 font-medium">Emails Sent</th>
//                 <th className="py-3 text-gray-600 font-medium">Open Rate</th>
//                 <th className="py-3 text-gray-600 font-medium">Click Rate</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentCampaigns.map((campaign, index) => (
//                 <tr key={index} className="border-b border-gray-100">
//                   <td className="py-3 text-gray-700">{campaign.name}</td>
//                   <td className="py-3 text-gray-700">{campaign.sent}</td>
//                   <td className="py-3 text-gray-700">{campaign.openRate}%</td>
//                   <td className="py-3 text-gray-700">{campaign.clickRate}%</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }














// "use client";
// import { useState } from "react";
// import { Line, Doughnut } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Filler,
//   ArcElement,
//   Tooltip,
// } from 'chart.js';
// import TotalEmailSentIcon from '@/components/icons/TotalEmailSentIcon';
// import OpenRateIcon from '@/components/icons/OpenRateIcon';
// import ClickRateIcon from '@/components/icons/ClickRateIcon';
// import ReplyRateIcon from '@/components/icons/ReplyRateIcon';

// // Register Chart.js components
// ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, ArcElement, Tooltip);

// // Reusable Card Component
// interface CardProps {
//   title: string;
//   icon: React.ReactNode;
//   total: number;
//   percentage: number;
//   timeFrame: string;
//   setTimeFrame: (value: string) => void;
//   chartData: any;
// }

// function Card({ title, icon, total, percentage, timeFrame, setTimeFrame, chartData }: CardProps) {
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: { display: false },
//       y: { display: false },
//     },
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: true,
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         titleFont: { size: 12 },
//         bodyFont: { size: 12 },
//         padding: 10,
//         cornerRadius: 4,
//       },
//     },
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-[300px] h-[120px] border border-gray-100">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-3">
//           <div className="bg-[#EAEDFD] bg-opacity-50 p-2 rounded-[8px]">{icon}</div>
//           <h1 className="text-xs text-gray-600 font-bold tracking-wide">{title}</h1>
//         </div>
//         <select
//           value={timeFrame}
//           onChange={(e) => setTimeFrame(e.target.value)}
//           className="text-xs text-gray-500 bg-transparent border-none focus:outline-none"
//         >
//           <option value="Hour">Hour</option>
//           <option value="Day">Day</option>
//           <option value="Week">Week</option>
//           <option value="Month">Month</option>
//         </select>
//       </div>
//       <div className="flex items-center justify-between mb-4">
//         <p className="text-3xl text-gray-800 font-semibold">{total}</p>
//         <div className="flex items-center space-x-1">
//           <span className="text-xs text-green-500 font-medium">
//             {percentage}% vs last {timeFrame.toLowerCase()}
//           </span>
//         </div>
//       </div>
//       {/* <div className="h-12 w-full">
//         <Line data={chartData} options={chartOptions} />
//       </div> */}
//     </div>
//   );
// }

// export default function DashboardPage() {
//   const [timeFrame, setTimeFrame] = useState('Week');

//   // Hardcoded data for different time frames and metrics
//   const dataMap = {
//     totalEmailSent: {
//       Hour: { labels: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM'], data: [50, 70, 60, 90, 100], total: 370, percentage: 10 },
//       Day: { labels: ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'], data: [200, 250, 300, 280, 320], total: 1350, percentage: 15 },
//       Week: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [400, 450, 500, 480, 550], total: 2256, percentage: 13 },
//       Month: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [800, 850, 900, 950], total: 3500, percentage: 20 },
//     },
//     openRate: {
//       Hour: { labels: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM'], data: [20, 30, 25, 40, 50], total: 165, percentage: 12 },
//       Day: { labels: ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'], data: [80, 90, 100, 95, 110], total: 475, percentage: 18 },
//       Week: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [60, 65, 70, 62, 80], total: 316, percentage: 20 },
//       Month: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [200, 210, 220, 230], total: 860, percentage: 25 },
//     },
//     clickRate: {
//       Hour: { labels: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM'], data: [15, 20, 18, 25, 30], total: 108, percentage: 8 },
//       Day: { labels: ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'], data: [60, 70, 80, 75, 85], total: 370, percentage: 15 },
//       Week: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [50, 55, 60, 52, 65], total: 266, percentage: 20 },
//       Month: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [150, 160, 170, 180], total: 660, percentage: 22 },
//     },
//     replyRate: {
//       Hour: { labels: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM'], data: [10, 15, 12, 20, 25], total: 82, percentage: 5 },
//       Day: { labels: ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'], data: [50, 60, 70, 65, 75], total: 320, percentage: 12 },
//       Week: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [45, 50, 55, 48, 60], total: 266, percentage: 20 },
//       Month: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [130, 140, 150, 160], total: 580, percentage: 18 },
//     },
//   };

//   // Chart data for each metric (for cards)
//   const chartData = (metric: string) => ({
//     labels: dataMap[metric][timeFrame].labels,
//     datasets: [
//       {
//         label: metric,
//         data: dataMap[metric][timeFrame].data,
//         borderColor: '#10B981', // Green for all card metrics
//         backgroundColor: 'rgba(16, 185, 129, 0.1)',
//         fill: true,
//         tension: 0.4,
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 0,
//       },
//     ],
//   });

//   // Data for Emails Sent Over Time Line Chart
//   const emailsSentOverTimeData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     datasets: [
//       {
//         label: 'Total Email Sent',
//         data: [320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430],
//         borderColor: '#10B981', // Green
//         backgroundColor: 'rgba(16, 185, 129, 0.1)',
//         fill: true,
//         tension: 0.4,
//         pointRadius: 0,
//         pointHoverRadius: 0,
//       },
//       {
//         label: 'Open Rate',
//         data: [210, 212, 214, 215, 216, 218, 220, 222, 224, 226, 228, 230],
//         borderColor: '#3B82F6', // Blue
//         backgroundColor: 'rgba(59, 130, 246, 0.1)',
//         fill: true,
//         tension: 0.4,
//         pointRadius: 0,
//         pointHoverRadius: 0,
//       },
//       {
//         label: 'Click Rate',
//         data: [160, 162, 164, 165, 166, 168, 170, 172, 174, 176, 178, 180],
//         borderColor: '#EF4444', // Red
//         backgroundColor: 'rgba(239, 68, 68, 0.1)',
//         fill: true,
//         tension: 0.4,
//         pointRadius: 0,
//         pointHoverRadius: 0,
//       },
//       {
//         label: 'Reply Rate',
//         data: [140, 142, 144, 145, 146, 148, 150, 152, 154, 156, 158, 160],
//         borderColor: '#8B5CF6', // Purple
//         backgroundColor: 'rgba(139, 92, 246, 0.1)',
//         fill: true,
//         tension: 0.4,
//         pointRadius: 0,
//         pointHoverRadius: 0,
//       },
//     ],
//   };

//   // Custom legend for line chart
//   const lineChartLegend = (
//     <div className="absolute bottom-4 left-4 flex space-x-4">
//       {emailsSentOverTimeData.datasets.map((dataset, index) => (
//         <div key={index} className="flex items-center space-x-2">
//           <div
//             className="w-4 h-4 rounded"
//             style={{ backgroundColor: dataset.borderColor }}
//           ></div>
//           <span className="text-sm text-gray-600">{dataset.label}</span>
//         </div>
//       ))}
//     </div>
//   );

//   const emailsSentOverTimeOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         grid: { display: false },
//         ticks: { color: '#6B7280', font: { size: 14 } },
//       },
//       y: {
//         grid: { borderDash: [5, 5], color: '#E5E7EB' },
//         ticks: { stepSize: 500, color: '#6B7280', font: { size: 14 } },
//       },
//     },
//     plugins: {
//       legend: { display: false }, // Disable default legend
//       tooltip: {
//         enabled: true,
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         titleFont: { size: 14 },
//         bodyFont: { size: 14 },
//         padding: 10,
//         cornerRadius: 4,
//       },
//     },
//   };

//   // Data for Email Status Breakdown Donut Chart
//   const emailStatusBreakdownData = {
//     labels: ['Delivered', 'Bounced', 'Unsubscribed'],
//     datasets: [
//       {
//         data: [85, 10, 5],
//         backgroundColor: ['#3B82F6', '#EF4444', '#D1D5DB'],
//         borderWidth: 0,
//         borderColor: '#FFFFFF',
//         cutout: '60%',
//       },
//     ],
//   };

//   // Custom legend for donut chart
//   const donutChartLegend = (
//     <div className="absolute bottom-4 left-4 flex space-x-4">
//       {emailStatusBreakdownData.labels.map((label, index) => (
//         <div key={index} className="flex items-center space-x-2">
//           <div
//             className="w-4 h-4 rounded"
//             style={{ backgroundColor: emailStatusBreakdownData.datasets[0].backgroundColor[index] }}
//           ></div>
//           <span className="text-sm text-gray-600">{label}</span>
//         </div>
//       ))}
//     </div>
//   );

//   const emailStatusBreakdownOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false }, // Disable default legend
//       tooltip: {
//         enabled: true,
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         titleFont: { size: 12 },
//         bodyFont: { size: 12 },
//         padding: 10,
//         cornerRadius: 4,
//       },
//     },
//   };

//   // Data for Recent Campaigns
//   const recentCampaigns = [
//     { name: 'Spring Sale 2025', sent: 5000, openRate: 25, clickRate: 12 },
//     { name: 'Product Launch', sent: 3000, openRate: 20, clickRate: 10 },
//     { name: 'Newsletter May', sent: 4000, openRate: 22, clickRate: 11 },
//   ];

//   // Icons for each metric
//   const icons = {
//     totalEmailSent: <TotalEmailSentIcon />,
//     openRate: <OpenRateIcon />,
//     clickRate: <ClickRateIcon />,
//     replyRate: <ReplyRateIcon />,
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 pt-24">
//       <div className="max-w-7xl mx-auto">
//         {/* Cards Row */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card
//             title="Total Email Sent"
//             icon={icons.totalEmailSent}
//             total={dataMap.totalEmailSent[timeFrame].total}
//             percentage={dataMap.totalEmailSent[timeFrame].percentage}
//             timeFrame={timeFrame}
//             setTimeFrame={setTimeFrame}
//             chartData={chartData('totalEmailSent')}
//           />
//           <Card
//             title="Open Rate"
//             icon={icons.openRate}
//             total={dataMap.openRate[timeFrame].total}
//             percentage={dataMap.openRate[timeFrame].percentage}
//             timeFrame={timeFrame}
//             setTimeFrame={setTimeFrame}
//             chartData={chartData('openRate')}
//           />
//           <Card
//             title="Click Rate"
//             icon={icons.clickRate}
//             total={dataMap.clickRate[timeFrame].total}
//             percentage={dataMap.clickRate[timeFrame].percentage}
//             timeFrame={timeFrame}
//             setTimeFrame={setTimeFrame}
//             chartData={chartData('clickRate')}
//           />
//           <Card
//             title="Reply Rate"
//             icon={icons.replyRate}
//             total={dataMap.replyRate[timeFrame].total}
//             percentage={dataMap.replyRate[timeFrame].percentage}
//             timeFrame={timeFrame}
//             setTimeFrame={setTimeFrame}
//             chartData={chartData('replyRate')}
//           />
//         </div>

//         {/* Charts Row */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           {/* Emails Sent Over Time Line Chart */}
//           <div className="lg:col-span-2 bg-white pb-10 pt-6 pl-6 pr-6 rounded-xl shadow-sm border border-gray-100 relative">
//             <h2 className="text-lg font-medium text-gray-800 mb-4">Email Metrics Over Time</h2>
//             {lineChartLegend}
//             <div className="h-[240px]">
//               <Line data={emailsSentOverTimeData} options={emailsSentOverTimeOptions} />
//             </div>
//           </div>

//           {/* Email Status Breakdown Donut Chart */}
//           <div className="lg:col-span-1 bg-white pb-10 pt-6 pl-6 pr-6 rounded-xl shadow-sm border border-gray-100 relative">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-medium text-gray-800">Email Status Breakdown</h2>
//               <select className="text-xs text-gray-500 bg-transparent border-none focus:outline-none">
//                 <option>This Week</option>
//                 <option>This Month</option>
//               </select>
//             </div>
//             {donutChartLegend}
//             <div className="h-[220px]">
//               <Doughnut data={emailStatusBreakdownData} options={emailStatusBreakdownOptions} />
//             </div>
//           </div>
//         </div>

//         {/* Recent Campaigns Table */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Campaigns</h2>
//           <table className="w-full text-left text-sm">
//             <thead>
//               <tr className="border-b border-gray-100">
//                 <th className="py-3 text-gray-600 font-medium">Campaign Name</th>
//                 <th className="py-3 text-gray-600 font-medium">Emails Sent</th>
//                 <th className="py-3 text-gray-600 font-medium">Open Rate</th>
//                 <th className="py-3 text-gray-600 font-medium">Click Rate</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentCampaigns.map((campaign, index) => (
//                 <tr key={index} className="border-b border-gray-100">
//                   <td className="py-3 text-gray-700">{campaign.name}</td>
//                   <td className="py-3 text-gray-700">{campaign.sent}</td>
//                   <td className="py-3 text-gray-700">{campaign.openRate}%</td>
//                   <td className="py-3 text-gray-700">{campaign.clickRate}%</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }