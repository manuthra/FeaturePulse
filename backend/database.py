from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

engine = create_engine("sqlite:///featurepulse.db")
Base = declarative_base()
Session = sessionmaker(bind=engine)

class ReviewAnalysis(Base):
    __tablename__ = "analyses"
    id = Column(Integer, primary_key=True)
    app_id = Column(String(200))
    bugs = Column(Text)
    features = Column(Text)
    loves = Column(Text)
    positive = Column(Float)
    negative = Column(Float)
    neutral = Column(Float)
    summary = Column(Text)
    total_reviews = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True)
    app_id = Column(String(200))
    content = Column(Text)
    score = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(engine)

def save_analysis(app_id, analysis, total_reviews):
    import json
    session = Session()
    record = ReviewAnalysis(
        app_id=app_id,
        bugs=json.dumps(analysis["bugs"]),
        features=json.dumps(analysis["features"]),
        loves=json.dumps(analysis["loves"]),
        positive=analysis["sentiment"]["positive"],
        negative=analysis["sentiment"]["negative"],
        neutral=analysis["sentiment"]["neutral"],
        summary=analysis["summary"],
        total_reviews=total_reviews
    )
    session.add(record)
    session.commit()
    session.close()

def save_reviews(app_id, reviews):
    session = Session()
    for r in reviews[:200]:
        review = Review(
            app_id=app_id,
            content=r["content"],
            score=r["score"]
        )
        session.add(review)
    session.commit()
    session.close()

def get_sql_insights(app_id):
    session = Session()
    from sqlalchemy import text
    
    results = {}

    # Average rating
    avg = session.execute(text(
        f"SELECT AVG(score) as avg_score FROM reviews WHERE app_id = '{app_id}'"
    )).fetchone()
    results["avg_rating"] = round(avg[0] or 0, 2)

    # Rating distribution
    dist = session.execute(text(
        f"SELECT score, COUNT(*) as count FROM reviews WHERE app_id = '{app_id}' GROUP BY score ORDER BY score"
    )).fetchall()
    results["rating_distribution"] = [{"score": r[0], "count": r[1]} for r in dist]

    # Total analyses
    total = session.execute(text(
        f"SELECT COUNT(*) FROM analyses WHERE app_id = '{app_id}'"
    )).fetchone()
    results["total_analyses"] = total[0]

    # Sentiment trend
    trend = session.execute(text(
        f"SELECT positive, negative, neutral, created_at FROM analyses WHERE app_id = '{app_id}' ORDER BY created_at DESC LIMIT 5"
    )).fetchall()
    results["sentiment_trend"] = [
        {"positive": r[0], "negative": r[1], "neutral": r[2], "date": str(r[3])}
        for r in trend
    ]

    session.close()
    return results