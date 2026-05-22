from jira import JIRA
from dotenv import load_dotenv
import os

load_dotenv()

def create_jira_tickets(bugs, app_id):
    try:
        jira = JIRA(
            server=os.getenv("JIRA_SERVER"),
            basic_auth=(os.getenv("JIRA_EMAIL"), os.getenv("JIRA_TOKEN"))
        )
        created = []
        for bug in bugs[:3]:
            issue = jira.create_issue(
                project=os.getenv("JIRA_PROJECT"),
                summary=f"[FeaturePulse] {bug}",
                description=f"Auto-generated from FeaturePulse analysis of {app_id}.\n\nBug reported by users: {bug}",
                issuetype={"name": "Bug"}
            )
            created.append({
                "key": issue.key,
                "url": f"{os.getenv('JIRA_SERVER')}/browse/{issue.key}",
                "summary": bug
            })
        return created
    except Exception as e:
        return [{"error": str(e)}]