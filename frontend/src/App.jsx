import { useState } from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import "./App.css";

export default function App() {

  const [appId, setAppId] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {

    if (!appId.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {

      const res = await axios.post(
        "http://localhost:5000/analyze",
        {
          appId: appId.trim(),
        }
      );

      if (res.data.success) {
        setData(res.data.data);
      } else {
        setError(res.data.error || "Something went wrong");
      }

    } catch (err) {

      setError(
        err.response?.data?.error ||
        "Cannot connect to server. Make sure backend is running."
      );

    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAnalyze();
    }
  };

  return (
    <div className="app">

      {/* Hero Section */}
      <div className="hero">

        <div className="hero-badge">
          ⚡ AI Powered Product Intelligence
        </div>

        <h1>
          FeaturePulse <span className="highlight">India</span>
        </h1>

        <p className="hero-sub">
          Paste any Google Play App ID and get instant AI-powered
          product insights, bug reports, feature requests and JIRA tickets
        </p>

        {/* Search Box */}
        <div className="search-box">

          <input
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter App ID e.g. com.swiggy.android"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
          >

            {loading ? (
              <span className="loading-text">
                <span className="spinner" />
                Analysing...
              </span>
            ) : (
              "Analyse App →"
            )}

          </button>

        </div>

        {/* Error */}
        {error && (
          <p className="error">
            ⚠️ {error}
          </p>
        )}

        {/* Sample Apps */}
        <div className="sample-apps">

          <p>Try these:</p>

          <div className="sample-tags">

            {[
              "com.swiggy.android",
              "com.phonepe.app",
              "com.meesho.supply",
              "com.zomato.ordering",
              "com.instagram.android",
              "com.whatsapp"
            ].map((id) => (

              <span
                key={id}
                className="sample-tag"
                onClick={() => setAppId(id)}
              >
                {id}
              </span>

            ))}

          </div>

        </div>

      </div>

      {/* Loading Screen */}
      {loading && (

        <div className="loading-screen">

          <div className="loading-card">

            <div className="big-spinner" />

            <h3>Analysing reviews...</h3>

            <p>
              Scraping → Cleaning → AI Analysis → Generating Report
            </p>

            <div className="progress-steps">

              <span className="step active">
                📥 Scraping
              </span>

              <span className="step active">
                🧹 Cleaning
              </span>

              <span className="step active">
                🤖 AI Analysis
              </span>

              <span className="step">
                📊 Report
              </span>

            </div>

          </div>

        </div>

      )}

      {/* Dashboard */}
      {data && !loading && (
        <Dashboard
          data={data}
          appId={appId}
        />
      )}

    </div>
  );
}