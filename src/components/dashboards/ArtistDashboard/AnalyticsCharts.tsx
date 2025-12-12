import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { analyticsData } from "./mock-data";

const chartCardStyle =
  "bg-[#1C1C1C] p-6 rounded-2xl border border-gray-800 shadow-xl";
const chartHeaderStyle = "text-xl font-bold text-white mb-4";

const PlaysOverTimeChart = () => (
  <div className={chartCardStyle}>
    <h3 className={chartHeaderStyle}>Plays Over Time</h3>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={analyticsData.playsOverTime.data.map((val, i) => ({
            name: analyticsData.playsOverTime.labels[i],
            plays: val,
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
          />
          <Line
            type="monotone"
            dataKey="plays"
            stroke="#A78BFA"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const DemographicsChart = () => {
  const data = analyticsData.listenerDemographics.labels.map((label, i) => ({
    name: label,
    value: analyticsData.listenerDemographics.data[i],
  }));
  const COLORS = ["#A78BFA", "#EC4899", "#3B82F6", "#F59E0B"];
  return (
    <div className={chartCardStyle}>
      <h3 className={chartHeaderStyle}>Listener Demographics</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TrackComparisonChart = () => (
  <div className={`${chartCardStyle} col-span-1 lg:col-span-2`}>
    <h3 className={chartHeaderStyle}>Track Performance Comparison</h3>
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={analyticsData.trackComparison.labels.map((label, i) => ({
            name: label,
            plays: analyticsData.trackComparison.data[i],
          }))}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" stroke="#9CA3AF" />
          <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={120} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
          />
          <Bar dataKey="plays" fill="#6366F1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AnalyticsCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <PlaysOverTimeChart />
      <DemographicsChart />
      <TrackComparisonChart />
    </div>
  );
};

export default AnalyticsCharts;
