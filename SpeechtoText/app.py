import os
import time
from flask import Flask, request, render_template, redirect, url_for, flash
from werkzeug.utils import secure_filename
import assemblyai as aai

# --- Configuration ---
# Best practice: Store your API key in an environment variable
ASSEMBLYAI_API_KEY = os.environ.get("ASSEMBLYAI_API_KEY")
UPLOAD_FOLDER = 'uploads'
# Common audio formats supported by AssemblyAI, you can extend this
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'm4a', 'mp4', 'ogg', 'flac', 'amr', 'aac', 'opus', 'webm'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = os.urandom(24) # Necessary for flash messages

# --- Helper Functions ---
def allowed_file(filename):
    """Checks if the uploaded file has an allowed extension."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- AssemblyAI Initialization ---
if ASSEMBLYAI_API_KEY:
    aai.settings.api_key = ASSEMBLYAI_API_KEY
else:
    # This will be caught and flashed in the route if key is missing
    print("WARNING: ASSEMBLYAI_API_KEY environment variable not set. Transcription will fail.")

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# --- Routes ---
@app.route('/', methods=['GET'])
def index():
    """Renders the main page with the upload form."""
    return render_template('index.html')

@app.route('/transcribe', methods=['POST'])
def upload_and_transcribe_file():
    """Handles file upload, transcription, and displays results."""
    if not ASSEMBLYAI_API_KEY:
        flash('AssemblyAI API key is not configured. Please set the ASSEMBLYAI_API_KEY environment variable.', 'error')
        return redirect(url_for('index'))

    if 'file' not in request.files:
        flash('No file part in the request.', 'error')
        return redirect(url_for('index'))

    file = request.files['file']

    if file.filename == '':
        flash('No file selected.', 'error')
        return redirect(url_for('index'))

    if file and allowed_file(file.filename):
        # Sanitize filename and make it unique to prevent overwrites
        filename_base, file_extension = os.path.splitext(file.filename)
        # Using timestamp for uniqueness; consider UUID for more robustness in high-traffic apps
        unique_filename = secure_filename(f"{filename_base}_{int(time.time())}{file_extension}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        transcription_text = None
        try:
            file.save(filepath)
            flash('File successfully uploaded. Starting transcription...', 'success')

            # Initialize the transcriber
            transcriber = aai.Transcriber()
            
            # Submit the file for transcription (synchronous call)
            # For very large files, consider asynchronous transcription:
            # transcript = transcriber.submit(filepath)
            # Then poll: while transcript.status not in [aai.TranscriptStatus.completed, aai.TranscriptStatus.error]:
            #               time.sleep(5)
            #               transcript = transcript.get()
            transcript = transcriber.transcribe(filepath)

            if transcript.status == aai.TranscriptStatus.error:
                flash(f'Transcription failed: {transcript.error}', 'error')
            elif not transcript.text:
                flash('Transcription complete, but no speech was detected or the result was empty.', 'success')
                transcription_text = "No speech detected or transcription was empty."
            else:
                flash('Transcription successful!', 'success')
                transcription_text = transcript.text
            
            return render_template('index.html', transcription_text=transcription_text)

        except Exception as e:
            app.logger.error(f"An error occurred during transcription: {e}")
            flash(f'An unexpected error occurred: {str(e)}', 'error')
            return redirect(url_for('index'))
        finally:
            # Clean up the uploaded file
            if os.path.exists(filepath):
                try:
                    os.remove(filepath)
                except Exception as e_remove:
                    app.logger.error(f"Error removing uploaded file {filepath}: {e_remove}")
    else:
        flash(f'File type not allowed. Allowed types are: {", ".join(ALLOWED_EXTENSIONS)}', 'error')
        return redirect(url_for('index'))

if __name__ == '__main__':
    print("To run this application:")
    print("1. Ensure you have Python and pip installed.")
    print("2. Install dependencies: pip install -r requirements.txt")
    print("3. Set your AssemblyAI API Key as an environment variable:")
    print("   Linux/macOS: export ASSEMBLYAI_API_KEY='YOUR_KEY_HERE'")
    print("   Windows CMD: set ASSEMBLYAI_API_KEY=YOUR_KEY_HERE")
    print("   Windows PowerShell: $env:ASSEMBLYAI_API_KEY='YOUR_KEY_HERE'")
    print(f"4. Run the app: python {os.path.basename(__file__)}")
    print("5. Open your browser to http://127.0.0.1:5000")
    app.run(debug=True)