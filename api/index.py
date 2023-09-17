from flask import Flask, request, jsonify
import requests
import json
import os
import openai
from PIL import Image
from base64 import b64decode
from io import BytesIO
from flask import send_file

app = Flask(__name__)

apiKey = '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'
MODEL_ENGINE = "gpt-4"
url = "https://api.openai.com/v1/chat/completions"
openai.api_key = "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"
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


@app.route('/api/generate-content')
def generate_content():
    return "Hello world"

@app.route('/api/process-text', methods=['POST'])
def process_text():
    return "process text not yet implemented"
    # Get the text from the request body
    text = request.json['text']

    # Process the text with ChatGPT API
    processed_text = process_with_chat_gpt(text)
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

@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz():
    return "generate quiz not yet implemented"
    # Get the text from the request body
    text = request.json['text']

    # Generate quiz with ChatGPT API
    quiz = generate_quiz_with_chatgpt(text)

    return jsonify(quiz)

    
def process_with_chat_gpt(text):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {apiKey}"
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

def generate_quiz_with_chatgpt(text):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {apiKey}"
    }

    data = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": text+"giving the above information,generating a quiz to test user's content,it better be a mutiple choice question very short and as precise as possible,like 1-3 questions(based on the amount of words in the article) to test people's understanding about the article,give the answer at the end in the following form with the answer all non capitalized,horizontally in format, e.g. 1.a 2.b 3.c "}],
        "temperature": 1.2
    }

    response = requests.post(url, headers=headers, json=data)
    completions = response.json()
    message1 = completions["choices"][0]["message"]["content"]
    return message1