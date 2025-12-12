import React from "react";
import AnalyticsCharts from "./AnalyticsCharts";

const Analytics = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-2">Explore your performance metrics.</p>
      </header>
      <AnalyticsCharts />
    </div>
  );
};

export default Analytics;
