import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import SQLInsights from "./SQLInsights";
import JiraTickets from "./JiraTickets";
import PowerBIExport from "./PowerBIExport";
import {
    FiAlertCircle,
    FiStar,
    FiHeart,
    FiPieChart,
    FiDownload
} from "react-icons/fi";

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

export default function Dashboard({ data, appId }) {

    // SAFE FALLBACKS
    const bugs = data?.bugs || [];
    const features = data?.features || [];
    const loves = data?.loves || [];
    const priorityActions = data?.priority_actions || [];

    const sentiment = data?.sentiment || {
        positive: 0,
        negative: 0,
        neutral: 0,
    };

    const sentimentData = [
        { name: "Positive", value: sentiment.positive },
        { name: "Negative", value: sentiment.negative },
        { name: "Neutral", value: sentiment.neutral },
    ];

    const handleDownload = () => {

        document.body.classList.add("pdf-mode");

        import("html2pdf.js").then((html2pdf) => {
            html2pdf.default()
                .set({
                    margin: 0.3,

                    filename: `${appId}-report.pdf`,

                    image: {
                        type: "png",
                        quality: 1
                    },

                    html2canvas: {
                        scale: 4,
                        useCORS: true,
                        backgroundColor: "#000814"
                    },

                    jsPDF: {
                        unit: "in",
                        format: "a4",
                        orientation: "portrait"
                    }
                })

                .from(document.getElementById("report"))

                .save()

                .then(() => {
                    document.body.classList.remove("pdf-mode");
                });

        });

    };
    return (
        <div className="dashboard" id="report">

            {/* Header */}
            <div className="report-header">
                <div>
                    <h2> Product Report — {appId}</h2>
                    <p className="score-badge">
                        Product Health Score: {data?.product_score || 0}/100
                    </p>
                </div>

                <button className="download-btn" onClick={handleDownload}>
                    <FiDownload /> Download PDF
                </button>
            </div>

            {/* Summary */}
            <p className="summary">
                {data?.summary || "No summary available"}
            </p>

            {/* Main Cards */}
            <div className="cards-grid">

                {/* Bugs */}
                <div className="card bugs">
                    <h3>Critical Bugs</h3>

                    <ul>
                        {bugs.map((b, i) => (
                            <li key={i}>{b}</li>
                        ))}
                    </ul>
                </div>

                {/* Features */}
                <div className="card features">
                    <h3>Requested Features</h3>

                    <ul>
                        {features.map((f, i) => (
                            <li key={i}>{f}</li>
                        ))}
                    </ul>
                </div>

                {/* Loves */}
                <div className="card loves">
                    <h3>What Users Love</h3>

                    <ul>
                        {loves.map((l, i) => (
                            <li key={i}>{l}</li>
                        ))}
                    </ul>
                </div>

                {/* Sentiment */}
                <div className="card sentiment">
                    <h3>Sentiment Breakdown</h3>

                    <ResponsiveContainer width="100%" height={340}>
                        <PieChart>

                            <Pie
                                data={sentimentData}
                                cx="50%"
                                cy="42%"
                                innerRadius={70}
                                outerRadius={105}
                                paddingAngle={3}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={1600}
                                animationEasing="ease-out"
                                stroke="none"

                            >
                                {sentimentData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip
                                contentStyle={{
                                    background: "#111827",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "14px",
                                    color: "#fff",
                                    fontSize: "14px"
                                }}
                                cursor={{ fill: "transparent" }}
                            />

                            <Legend
                                iconType="circle"
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                formatter={(value, entry, index) => (
                                    <span
                                        style={{
                                            color: "#d1d5db",
                                            fontSize: "14px",
                                            marginRight: "18px"
                                        }}
                                    >
                                        {value}
                                    </span>
                                )}
                                wrapperStyle={{
                                    paddingTop: "30px"
                                }}
                            />

                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Priority Actions */}
            <div className="priority-section">
                <h3>Priority Actions</h3>

                <div className="priority-grid">
                    {priorityActions.map((action, i) => (
                        <div key={i} className="priority-card">
                            <span className="priority-num">
                                {i + 1}
                            </span>

                            <p>{action}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* SQL Insights */}
            <SQLInsights appId={appId} />

            {/* Jira Tickets */}
            <JiraTickets bugs={bugs} appId={appId} />

            {/* Power BI Export */}
            <PowerBIExport appId={appId} />

        </div>
    );
}