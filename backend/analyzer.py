from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

from dotenv import load_dotenv
import json
import os

load_dotenv()

llm = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0.3,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

analysis_prompt = PromptTemplate(
    input_variables=["reviews"],
    template="""
You are a senior AI product analyst. Analyze these app reviews carefully.
Return ONLY a valid JSON object. No explanation. No markdown. Just JSON.

{{
  "bugs": ["bug 1", "bug 2", "bug 3", "bug 4", "bug 5"],
  "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"],
  "loves": ["love 1", "love 2", "love 3"],
  "sentiment": {{
    "positive": 60,
    "negative": 25,
    "neutral": 15
  }},
  "summary": "One paragraph product health summary",
  "priority_actions": ["action 1", "action 2", "action 3"],
  "product_score": 72
}}

Reviews to analyze:
{reviews}
"""
)

chain = analysis_prompt | llm

def analyze_with_langchain(reviews_list):
    combined = "\n".join([
        f"Rating {r['score']}/5: {r['content']}"
        for r in reviews_list[:100]
    ])
    result = chain.invoke({"reviews": combined}).content
    clean = result.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)