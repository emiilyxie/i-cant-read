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
from PyPDF2 import PdfReader
import prodia
from prodia import SdModel
import re
import pyttsx4

app = Flask(__name__)

load_dotenv()
# api_key = os.getenv("api_key")
api_key = os.environ.get("api_key")
MODEL_ENGINE = "gpt-4"
url = "https://api.openai.com/v1/chat/completions"
openai.api_key = api_key
TMP_FOLDER = "/tmp"

# prodia_key= os.getenv("art_key")
prodia_key= os.environ.get("art_key")
client = prodia.Client(api_key=prodia_key)

engine = pyttsx4.init()

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


@app.route('/api/parse-pdf', methods=['POST'])
def parse_pdf():
    
    content = request.files['file'].read()
    p = BytesIO(content)
    pdf = PdfReader(p)

    res = ""

    for page in pdf.pages:
        res += f"{page.extract_text()}\n"

    # with open(os.path.join(TMP_FOLDER, "input.txt"), "w") as f:
    #     for page in pdf.pages:
    #         f.write(page.extract_text())

    return jsonify({"data": res})
        

@app.route('/api/tts', methods=['POST'])
def tts():
    text = request.json['text']
    engine.setProperty("rate", 150)
    engine.say(text)
    engine.runAndWait()

    return {"status": "done"}

@app.route('/api/stoptts', methods=['POST'])
def stoptts():
    engine.stop()
    return {"status": "done"}

@app.route('/api/get-text')
def get_text():
    # read the file back and return it
    with open(os.path.join(TMP_FOLDER, "input.txt"), "r") as f:
        text = f.read()

    text = list(filter(lambda t: t != "", text.split("\n")))
    return jsonify({"data": text})

@app.route('/api/get-image', methods=['POST'])
def get_image():
    
    text = request.json['text']
    processed_text = get_img_prompt(text)

    image = client.sd_generate(
        prompt=processed_text,
        negative_prompt="badly drawn, blurry, low quality",
        model=SdModel.ANYTHING_V5,
        upscale=True,
        aspect_ratio="landscape")
    url=image.url

    response = requests.get(url)
    
    return send_file(BytesIO(response.content), mimetype='image/png')

@app.route('/api/summarize', methods=['POST'])
def summarize():
    text = request.json['text']

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": text + " using the text above to generate 15-25 words a very accurate and precise summary"}],
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
    answers = generate_answer_with_chatgpt(quiz)
    parsed_quiz = parse_quiz(quiz, answers)
    return jsonify({"data": {"quiz": parsed_quiz, "original": quiz, "answers": answers}})

@app.route('/api/generate-title', methods=['POST'])
def generate_title():
    text = request.json['text']

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": text+"using the text above to generate a simple title to summarize the content of the article"}],
        "temperature": 0.3
    }

    response = requests.post(url, headers=headers, json=data)
    completions = response.json()
    message = completions["choices"][0]["message"]["content"]
    return jsonify({"data": message})
    
def get_img_prompt(text):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": text+"using the text above to generate a very accurate and precise 15-20 words prompt for AI generate art to generate art that contains educational and informative content,make sure the important thing are at the front in the prompt and be very precise about the image"}],
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
        "messages": [{"role": "user", "content":text+"giving the above quiz, give the answer in the following form: 1.a 2.b"}],
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
    "temperature": 0.2
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

    numbers = re.findall('\d+', answers)
    letters = re.findall('[a-zA-Z]+', answers)
    answers = list(zip(numbers, letters))# Outputs: [('1', 'a'), ('2', 'b')]

    parsed_quiz = []
    
    # Extract the answers
    answer_dict = {}
    for answer in answers:
        answer_dict[int(answer[0])] = answer[1]

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