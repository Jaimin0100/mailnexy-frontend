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
  totalEmailSent: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  bounceRate: number;
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
    totalEmailSent: 0,
    openRate: 0,
    clickRate: 0,
    replyRate: 0,
    bounceRate: 0,
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
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch stats
        let statsData = { total_email_sent: 0, open_rate: 0, click_rate: 0, reply_rate: 0, bounce_rate: 0 };
        try {
          const statsResponse = await fetch('http://localhost:5000/api/v1/dashboard/stats', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
          if (!statsResponse.ok) {
            console.error('Stats API response status:', statsResponse.status, statsResponse.statusText);
            throw new Error('Failed to fetch stats');
          }
          statsData = await statsResponse.json();
          console.log('Stats API response:', statsData);
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
        setStats({
          totalEmailSent: statsData.total_email_sent || statsData.totalEmailSent || 0,
          openRate: statsData.open_rate || statsData.open_rate || 0,
          clickRate: statsData.click_rate || statsData.clickRate || 0,
          replyRate: statsData.reply_rate || statsData.replyRate || 0,
          bounceRate: statsData.bounce_rate || statsData.bounceRate || 0,
        });

        // Fetch metrics and status breakdown
        let metricsData = { metrics: { labels: [], datasets: [] }, statusBreakdown: null };
        try {
          const metricsResponse = await fetch('http://localhost:5000/api/v1/dashboard/metrics', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
          if (!metricsResponse.ok) {
            console.error('Metrics API response status:', metricsResponse.status, metricsResponse.statusText);
            throw new Error('Failed to fetch metrics');
          }
          metricsData = await metricsResponse.json();
          console.log('Metrics API response:', metricsData);
        } catch (error) {
          console.error('Error fetching metrics:', error);
        }
        setMetrics(metricsData.metrics || { labels: [], datasets: [] });
        if (metricsData.statusBreakdown && metricsData.statusBreakdown.datasets[0].data.some((val: number) => val > 0)) {
          setStatusBreakdown(metricsData.statusBreakdown);
        }

        // Fetch recent campaigns
        let campaignsData = { recentCampaigns: [] };
        try {
          const campaignsResponse = await fetch('http://localhost:5000/api/v1/dashboard/recent-campaigns', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
          if (!campaignsResponse.ok) {
            console.error('Campaigns API response status:', campaignsResponse.status, campaignsResponse.statusText);
            throw new Error('Failed to fetch recent campaigns');
          }
          campaignsData = await campaignsResponse.json();
          console.log('Campaigns API response:', campaignsData);
        } catch (error) {
          console.error('Error fetching recent campaigns:', error);
        }
        setRecentCampaigns(campaignsData.recentCampaigns || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  const chartData = (metric: keyof Omit<Stats, 'bounceRate'>) => ({
    labels: [],
    datasets: [
      { 
        label: metric,
        data: [],
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
      {isLoading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            title="Total Email Sent"
            icon={icons.totalEmailSent}
            total={stats.totalEmailSent}
            percentage={0}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            chartData={chartData('totalEmailSent')}
          />
          <Card
            title="Open Rate"
            icon={icons.openRate}
            total={stats.openRate}
            percentage={0}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            chartData={chartData('openRate')}
          />
          <Card
            title="Click Rate"
            icon={icons.clickRate}
            total={stats.clickRate}
            percentage={0}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            chartData={chartData('clickRate')}
          />
          <Card
            title="Reply Rate"
            icon={icons.replyRate}
            total={stats.replyRate}
            percentage={0}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            chartData={chartData('replyRate')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white pb-10 pt-6 pl-6 pr-6 rounded-xl border border-gray-200 relative">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Email Metrics Over Time</h2>
            <div className="absolute bottom-4 left-4 flex space-x-4">
              {metrics.datasets?.map((dataset, index) => (
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
      )}
    </div>
  );
}