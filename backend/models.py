from pydantic import BaseModel, Field
from typing import List

class QuizQuestion(BaseModel):
    question: str = Field(description="The quiz question text")
    options: List[str] = Field(description="Four answer options")
    correct_answer: str = Field(description="The correct answer from the options")
    explanation: str = Field(description="Brief explanation of why this is correct")

class QuizOutput(BaseModel):
    title: str = Field(description="Title of the Wikipedia article")
    summary: str = Field(description="Brief 2-3 sentence summary of the article")
    key_entities: List[str] = Field(description="5-7 key entities, people, or concepts from the article")
    questions: List[QuizQuestion] = Field(description="5-10 quiz questions")
    related_topics: List[str] = Field(description="3-5 related topics for further exploration")

class QuizRequest(BaseModel):
    url: str

class QuizHistoryItem(BaseModel):
    id: int
    url: str
    title: str
    date_generated: str

class QuizDetailResponse(BaseModel):
    id: int
    url: str
    title: str
    date_generated: str
    quiz_data: QuizOutput
