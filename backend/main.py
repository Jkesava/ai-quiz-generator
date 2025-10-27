from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import json

from database import get_db, init_db, Quiz
from models import QuizRequest, QuizOutput, QuizHistoryItem, QuizDetailResponse
from scraper import scrape_wikipedia
from llm_quiz_generator import generate_quiz

app = FastAPI(title="AI Wiki Quiz Generator")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def read_root():
    return {"message": "AI Wiki Quiz Generator API", "status": "active"}

@app.post("/generate_quiz", response_model=QuizOutput)
def generate_quiz_endpoint(request: QuizRequest, db: Session = Depends(get_db)):
    """
    Generates a quiz from a Wikipedia URL.
    
    1. Scrapes the Wikipedia article
    2. Uses LLM to generate structured quiz
    3. Saves to database
    4. Returns the quiz data
    """
    try:
        print(f"Scraping Wikipedia: {request.url}")
        # Step 1: Scrape Wikipedia
        article_text, article_title = scrape_wikipedia(request.url)
        
        print(f"Generating quiz for: {article_title}")
        # Step 2: Generate quiz using LLM - PASS BOTH ARGUMENTS
        quiz_data = generate_quiz(article_text, article_title)
        
        print(f"Quiz generated successfully, saving to database...")
        # Step 3: Save to database
        quiz_json = quiz_data.model_dump_json()
        
        new_quiz = Quiz(
            url=request.url,
            title=quiz_data.title,
            date_generated=datetime.utcnow(),
            scraped_content=article_text,
            full_quiz_data=quiz_json
        )
        
        db.add(new_quiz)
        db.commit()
        db.refresh(new_quiz)
        
        print(f"Quiz saved with ID: {new_quiz.id}")
        # Step 4: Return the quiz data
        return quiz_data
        
    except ValueError as e:
        print(f"ValueError: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")

@app.get("/history", response_model=list[QuizHistoryItem])
def get_quiz_history(db: Session = Depends(get_db)):
    """
    Returns a list of all generated quizzes with basic information.
    """
    try:
        quizzes = db.query(Quiz).order_by(Quiz.date_generated.desc()).all()
        
        history = [
            QuizHistoryItem(
                id=quiz.id,
                url=quiz.url,
                title=quiz.title,
                date_generated=quiz.date_generated.isoformat()
            )
            for quiz in quizzes
        ]
        
        return history
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")

@app.get("/quiz/{quiz_id}", response_model=QuizDetailResponse)
def get_quiz_detail(quiz_id: int, db: Session = Depends(get_db)):
    """
    Returns complete quiz data for a specific quiz ID.
    Deserializes the stored JSON back into structured format.
    """
    try:
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        # Deserialize JSON string back to Python dict
        quiz_data_dict = json.loads(quiz.full_quiz_data)
        quiz_data = QuizOutput(**quiz_data_dict)
        
        return QuizDetailResponse(
            id=quiz.id,
            url=quiz.url,
            title=quiz.title,
            date_generated=quiz.date_generated.isoformat(),
            quiz_data=quiz_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching quiz: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
