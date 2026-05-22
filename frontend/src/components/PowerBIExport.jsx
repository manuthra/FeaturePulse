import { useState } from "react";
import axios from "axios";

export default function PowerBIExport({ appId }) {
    const [status, setStatus] = useState("");

    const handleExport = async () => {
        try {
            setStatus("Exporting...");

            window.open(
                `http://localhost:5000/export-csv/${appId}`,
                "_blank"
            );

            setStatus("✅ CSV downloaded successfully");
        } catch (err) {
            setStatus("❌ Export failed");
        }
    };

    return (
        <div className="powerbi-section">
            <h3>📈 Power BI Export</h3>
            <p>Export reviews as CSV → import directly into Power BI for advanced dashboards</p>
            <button className="powerbi-btn" onClick={handleExport}>
                📥 Export CSV for Power BI
            </button>
            {status && <p className="export-status">{status}</p>}
        </div>
    );
}