from flask import Flask, request, render_template, send_file
from gtts import gTTS
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/speak', methods=['POST'])
def speak():
    text = request.form['text']
    if not text.strip():
        return "Please enter some text", 400

    tts = gTTS(text)
    filepath = "static/output.mp3"
    tts.save(filepath)
    return send_file(filepath, mimetype="audio/mpeg")

if __name__ == '__main__':
    app.run(debug=True)