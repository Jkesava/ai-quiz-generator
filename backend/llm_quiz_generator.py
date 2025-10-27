import google.generativeai as genai
from models import QuizOutput
import os
import json
from dotenv import load_dotenv

load_dotenv()

def generate_quiz(article_text: str, article_title: str) -> QuizOutput:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not found")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash-001')

    prompt = f"""Create a quiz from this Wikipedia article in JSON format.

Article Title: {article_title}
Article Content: {article_text}

Return JSON with: title, summary, key_entities (5-7 items), questions (5-10 items with question, options, correct_answer, explanation), related_topics (3-5 items).

Each question needs exactly 4 options. The correct_answer must match one option exactly."""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        # Remove code fence markers
        triple_backtick = chr(96) + chr(96) + chr(96)
        if text.startswith(triple_backtick):
            lines = text.split('\n')
            text = '\n'.join(lines[1:])
            if text.endswith(triple_backtick):
                text = text[:-3]

        text = text.strip()

        # Parse JSON
        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end > start:
                data = json.loads(text[start:end])
            else:
                raise

        return QuizOutput(**data)

    except Exception as e:
        raise Exception(f"Failed to generate quiz: {str(e)}")