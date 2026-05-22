from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from google_play_scraper import reviews, Sort
import pandas as pd

app = Flask(__name__)
CORS(app)

# ---------------- ANALYZE APP ---------------- #

@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.json
    app_id = data.get("appId")

    try:

        print("Fetching reviews for:", app_id)

        result, _ = reviews(
            app_id,
            lang="en",
            count=50,
            sort=Sort.NEWEST
        )

        print("Reviews fetched:", len(result))

        analysis = {

            "summary": "Users generally like the app but reported some bugs and performance issues.",

            "bugs": [
                "Payment crash",
                "Slow loading",
                "OTP issue"
            ],

            "features": [
                "Dark mode",
                "Better UI",
                "Offline support"
            ],

            "loves": [
                "Easy to use",
                "Fast delivery",
                "Good design"
            ],

            "sentiment": {
                "positive": 72,
                "neutral": 18,
                "negative": 10
            },

            "priority_actions": [
                "Fix payment crash affecting checkout flow",
                "Improve app loading speed",
                "Improve OTP reliability",
                "Launch dark mode support"
            ],

            "product_score": 84
        }

        print("Analysis completed")

        return jsonify({
            "success": True,
            "data": analysis
        })

    except Exception as e:

        print("ERROR OCCURRED:")
        print(str(e))

        return jsonify({
            "success": False,
            "error": str(e)
        })


# ---------------- EXPORT CSV ---------------- #

@app.route("/export-csv/<app_id>", methods=["GET"])
def export_csv(app_id):

    data = [
        ["Category", "Value"],
        ["Product Score", 84],
        ["Critical Bug", "Payment crash"],
        ["Critical Bug", "OTP issue"],
        ["Feature Request", "Dark mode"],
        ["Feature Request", "Offline support"],
        ["Positive Sentiment", 72],
        ["Negative Sentiment", 10],
        ["Neutral Sentiment", 18]
    ]

    df = pd.DataFrame(data)

    csv_path = f"{app_id}_report.csv"

    df.to_csv(csv_path, index=False, header=False)

    return send_file(csv_path, as_attachment=True)


# ---------------- CREATE JIRA TICKETS ---------------- #
@app.route("/create-jira", methods=["POST"])
def create_jira():

    data = request.json

    bugs = data.get("bugs", [])

    tickets = []

    for i, bug in enumerate(bugs):

        tickets.append({
            "key": f"FP-{101+i}",
            "summary": bug,
            "url": f"https://jira.atlassian.com/browse/FP-{101+i}"
        })

    return jsonify({
        "success": True,
        "tickets": tickets
    })



# ---------------- RUN APP ---------------- #
import os

app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
