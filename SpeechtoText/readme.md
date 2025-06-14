# Flask Speech-to-Text App with AssemblyAI

This is a simple Flask web application that allows users to upload an audio file and get its transcription using the AssemblyAI API.

## Features

-   Upload audio files (supports common formats like WAV, MP3, M4A, etc.).
-   Transcribe audio using AssemblyAI's synchronous transcription.
-   Display transcription results on the web page.
-   User feedback via flash messages for success and errors.
-   Temporary uploaded files are automatically cleaned up.

## Prerequisites

-   Python 3.7+
-   pip (Python package installer)
-   An AssemblyAI API Key. You can get one from [https://www.assemblyai.com/](https://www.assemblyai.com/).

## Setup and Running

1.  **Clone the repository or create the files:**
    If you have the files, navigate to the `speech-to-text-flask` directory. Otherwise, create the directory and the files (`app.py`, `requirements.txt`, `README.md`, and the `templates/index.html` file) as shown above.

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    ```
    Activate the virtual environment:
    -   On macOS and Linux:
        ```bash
        source venv/bin/activate
        ```
    -   On Windows:
        ```bash
        venv\Scripts\activate
        ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set your AssemblyAI API Key:**
    You **must** set your AssemblyAI API key as an environment variable. Replace `"YOUR_ASSEMBLYAI_API_KEY"` with your actual key.

    -   **Linux/macOS (bash/zsh):**
        ```bash
        export ASSEMBLYAI_API_KEY="YOUR_ASSEMBLYAI_API_KEY"
        ```
        To make it permanent, add this line to your `~/.bashrc`, `~/.zshrc`, or shell configuration file.

    -   **Windows (Command Prompt):**
        ```bash
        set ASSEMBLYAI_API_KEY="YOUR_ASSEMBLYAI_API_KEY"
        ```
        This sets it for the current session. For a more permanent solution, search for "environment variables" in Windows settings.

    -   **Windows (PowerShell):**
        ```bash
        $env:ASSEMBLYAI_API_KEY="YOUR_ASSEMBLYAI_API_KEY"
        ```
        This sets it for the current session. To make it permanent, add it to your PowerShell profile.

5.  **Run the Flask application:**
    ```bash
    python app.py
    ```

6.  **Access the application:**
    Open your web browser and go to `http://120.0.1:5000/`.

## How It Works

1.  The user navigates to the homepage (`/`), which displays an upload form.
2.  The user selects an audio file and clicks "Upload and Transcribe".
3.  The file is POSTed to the `/transcribe` endpoint.
4.  The Flask application (`app.py`):
    a.  Validates the API key and the uploaded file (presence, extension).
    b.  Saves the file temporarily to the `uploads/` directory with a unique name.
    c.  Uses the AssemblyAI Python SDK to send the audio file for transcription. This example uses synchronous transcription, meaning the app waits for the result.
    d.  Once transcription is complete (or if an error occurs), it retrieves the text or error message.
    e.  Deletes the temporary audio file from the server.
    f.  Re-renders the `index.html` template, displaying the transcription or any relevant messages.

## Important Notes

-   **API Key Security:** Your AssemblyAI API key is sensitive. Using environment variables is a secure way to handle it, preventing it from being hardcoded into your source code.
-   **Error Handling:** The application includes basic error handling for API key issues, file uploads, and transcription failures.
-   **File Storage:** Uploaded files are stored temporarily in the `uploads/` directory and are deleted after processing. This directory is created automatically if it doesn't exist.
-   **Large Files & Long Transcriptions:** This example uses AssemblyAI's synchronous transcription (`transcriber.transcribe()`), which is suitable for smaller files or when you need an immediate result. For very large audio files or long-running transcription jobs, AssemblyAI's asynchronous transcription (`transcriber.submit()` followed by polling or webhooks) is recommended to avoid long request timeouts and provide a better user experience. The comments in `app.py` briefly mention this.
-   **Allowed File Types:** The `ALLOWED_EXTENSIONS` set in `app.py` defines which audio file types are accepted. You can modify this list based on the formats supported by AssemblyAI and your needs.
-   **Debug Mode:** The application runs in `debug=True` mode, which is helpful for development but should be turned off for production.