from openai import OpenAI 
import json


def content_type(type, content):
    if(type == 1):
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", 
                "content": "You are going to act as a teacher for content relating to anatomy at a college level. Search college level journals/articles/textbooks an use that information to gernerate an informative summary. At the end create 3 questions pertaining to the topic and a paragragh at the end explaining why it is correct."
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
                        "Generate a quiz of 10 4-choice questions based on the topic provided. "
                        "Provide the output in the following as a list of where each element has the following format: "
                        '{"id": "...", "question": "...", "options": ["...", "...", "...", "..."], "correct" : "...", "chosen": *leave blank*}'
                    ),
                },
                {"role": "user", "content": content},
            ],
            timeout=30
        )
        questions_list = json.loads(response.choices[0].message.content)

        qna = {
            'chapter': content,
            'questions': questions_list
        }
        # Convert to JSON string
        qna_json = json.dumps(qna, indent=4)
        return qna_json
    
    elif(type == 3):

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", 
                "content": "You are going to act as a teacher teaching a student college level anatomy content, with a quiz like format. You will be given a question and a series of answers and the answer chosen by the student, analyze their choice, determine if it is correct or not and explain why. In addition go through each answer choice and explain why it is correct or wrong."
                },
                {"role": "user",
                 "content": f"{content}"
                }
            ],
            timeout=30
        )
        return response.choices[0].message.content
    elif (type == 4):
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", 
                "content": "You are going to act as a student practicing with a teacher, with a quiz like format. You will be given a question and a series of answers, choose an answer and the teacher will analyze your choice, determine if it is correct or not and explain why. In addition go through each answer choice and explain why it is correct or wrong."
                },
                {"role": "user",
                "content": f"{content}"
                }
            ],
            timeout=30
        )
        return response.choices[0].message.content
    return "Invalid type selected."
    
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


data = content_type(2, 'Digestive System')

print(data)