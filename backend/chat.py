from openai import OpenAI 
import json

API_KEY = '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'
client = OpenAI(api_key=API_KEY)

def content_type(type, content):
    if(type == 1):
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", 
                "content": (
                    "You are going to act as a teacher for content relating to anatomy at a college level. Search college level journals/articles/textbooks an use that information to gernerate an informative summary."
                    "Make sure the summary is as long as it is informative. Write at least 3-4 paragraphs."
                    "At the end create 3 questions pertaining to the topic and a paragragh at the end explaining why it is correct."
                    "Format the summary and questions neatly as if they were about be in a website."
                )
                },
                {"role": "user", 
                "content": f"{content}"
                }
            ],
            timeout=30
        )
        return response.choices[0].message.content
    if type == 2:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are going to act as a teacher practicing with a student in a quiz format. "
                        "The content is related to anatomy at a college level. You will be given a sub topic."
                        "Generate a quiz of 10 4-choice questions based on the topic provided. Make sure the questions are challening and informative for students at a college level."
                        "Provide the output in valid JSON format as a list, where each element has the following structure: "
                        '{"id": "...", "question": "...", "options": ["a1": "...", "a2": "...","a3" : "...", "a4" : "..."], "correct" : "...", "chosen": *leave blank*} keep a1, a2, a3, a4 consistent for each question to act as an id.'
                    ),
                },
                {"role": "user", "content": content},
            ],
            timeout=30
        )
        questions = response.choices[0].message.content
        print(questions)
        qna = {
            'chapter': content,
            'questions': questions
        }
        return qna
    
    
def parse_qna(string):
    lines = string.strip().split('\n')
    question = lines[0].strip()
    answers = {
        'A)': lines[2].strip(),
        'B)': lines[3].strip(),
        'C)': lines[4].strip(),
        'D)': lines[5].strip(),
        'Correct Answer': lines[7].strip(), 
        'Chosen': ''
    }
    return [question, answers]