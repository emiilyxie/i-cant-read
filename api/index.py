from flask import Flask, request, jsonify
import requests
import json
import os
import openai
from PIL import Image
from base64 import b64decode
from io import BytesIO
from flask import send_file
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()
api_key = os.getenv("api_key")
MODEL_ENGINE = "gpt-4"
url = "https://api.openai.com/v1/chat/completions"
openai.api_key = api_key
TMP_FOLDER = "/tmp"

@app.route('/api/')
def hello():
    return "Hello world"

@app.route('/api/save-text', methods=['POST'])
def save_text():
    text = request.json['text']

    # write a file
    with open(os.path.join(TMP_FOLDER, "input.txt"), "w") as f:
        f.write(text)

    return {"status": "text saved."}
        

@app.route('/api/get-text')
def get_text():
    # read the file back and return it
    with open(os.path.join(TMP_FOLDER, "input.txt"), "r") as f:
        text = f.read()

    text = list(filter(lambda t: t != "", text.split("\n")))
    return jsonify({"data": text})

@app.route('/api/get-image', methods=['POST'])
def get_image():
    # Get the text from the request body
    text = request.json['text']

    # Process the text with ChatGPT API
    processed_text = get_img_prompt(text)
    # Generate image
    response = openai.Image.create(
        prompt=processed_text+"High resolution"+"4k"+"very precise"+"cute style that is suitable for kids",
        n=1,
        size="512x512",
        response_format="b64_json"
    )
    
    image_b64 = response['data'][0]['b64_json']
    
    # Convert the base64 string to a PIL Image object
    img = Image.open(BytesIO(b64decode(image_b64)))
    
    # Create a BytesIO object and save the image to it
    img_io = BytesIO()
    img.save(img_io, 'JPEG', quality=70)
    
    # Seek to the beginning of the BytesIO object
    img_io.seek(0)
    
    # Send the image as a file
    return send_file(img_io, mimetype='image/jpeg')

@app.route('/api/summarize', methods=['POST'])
def summarize():
    text = request.json['text']
    print(text)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": text+"using the text above to generate 15-25 words a very accurate and precise summary"}],
        "temperature": 0.7
    }

    response = requests.post(url, headers=headers, json=data)
    completions = response.json()
    message = completions["choices"][0]["message"]["content"]
    return jsonify({"data": message})

@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz():
    # Get the text from the request body
    text = request.json['text']
    # Generate quiz with ChatGPT API
    quiz = generate_quiz_with_chatgpt(text)
    answers=generate_answer_with_chatgpt(quiz)
    print(quiz)
    print(answers)
    return jsonify({"data": {"quiz": quiz, "answers": answers}})

    
def get_img_prompt(text):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": text+"using the text above to generate a very accurate and precise 10-15 words prompt for AI generate art to generate something"}],
        "temperature": 1.2
    }

    response = requests.post(url, headers=headers, json=data)
    completions = response.json()
    message = completions["choices"][0]["message"]["content"]
    return message

def generate_answer_with_chatgpt(text):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content":text+"giving the above quiz, give the answer in the following form: answers:1.a 2.b"}],
    "temperature": 0.4
    }
    response = requests.post(url, headers=headers, json=data)
    completions = response.json()
    message2 = completions["choices"][0]["message"]["content"]
    return message2

def generate_quiz_with_chatgpt(text):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": text+"giving the above information,generating two quizs to test user's content,it better be a mutiple choice question very short and as precise as possible, this is just a format for how the output for quiz and answer should be,make sure very very strictly stick to the format:"+
    '''
    1. Question 1
    a. Option 1
    b. Option 2
    c. Option 3
    d. Option 4

    1. Question 2
    a. Option 1
    b. Option 2
    c. Option 3
    d. Option 4'''
    }],
    "temperature": 0.3
    }
    

    response = requests.post(url, headers=headers, json=data)
    completions = response.json()
    message1 = completions["choices"][0]["message"]["content"]
    return message1

def parse_quiz(quiz, answers):
    lines = quiz.split('\n')

    # Initialize a new string to store the quiz without empty lines
    new_quiz = ""

    # Iterate through the lines and add non-empty lines to the new_quiz
    for line in lines:
        if line.strip():  # Check if the line is not empty after stripping whitespace
            new_quiz += line + '\n'
    quiz=new_quiz
    # Split the quiz and answers into lines
    quiz_lines = quiz.strip().split('\n')
    answer_lines = answers.split()
    parsed_quiz = []
    
    # Extract the answers
    answer_dict = {}
    for line in answer_lines:
        parts = line.split('.')
        if len(parts) == 2:
            question_num = int(parts[0])
            answer = parts[1]
            answer_dict[question_num] = answer

    for i in range(0, len(quiz_lines), 5):
        # Check if there are enough lines remaining for the options
        if i + 4 < len(quiz_lines):
            # Get the question and options
            question = quiz_lines[i].strip()
            options = [quiz_lines[i+j].strip() for j in range(1, 5)]
            # Check if the question is not empty
            if question:
                question_num = int(question.split('.')[0])
                # Check if there's a corresponding answer
            if question_num is not None and question_num in answer_dict:
                    answer = answer_dict[question_num]
                    # Add the parsed question to the list
                    parsed_quiz.append({
                    'question': question,
                    'options': options,
                    'answer': answer
                })
        else:
            print(f"Error: Not enough lines for question {i//5 + 1}")

    return parsed_quiz