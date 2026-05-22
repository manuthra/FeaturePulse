import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SQLInsights({ appId }) {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    axios.get(`https://featurepulse-cls3.onrender.com/sql-insights/${appId}`)
      .then(res => { if (res.data.success) setInsights(res.data.data); });
  }, [appId]);

  if (!insights) return null;

  return (
    <div className="sql-section">
      <h3>🗄️ SQL Database Insights</h3>
      <div className="sql-grid">
        <div className="sql-card">
          <p className="sql-label">Average Rating</p>
          <p className="sql-value">{insights.avg_rating} ⭐</p>
        </div>
        <div className="sql-card">
          <p className="sql-label">Total Analyses Run</p>
          <p className="sql-value">{insights.total_analyses}</p>
        </div>
      </div>
      <div className="chart-box">
        <p className="chart-title">Rating Distribution</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={insights.rating_distribution}>
            <XAxis dataKey="score" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#1a56db" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}