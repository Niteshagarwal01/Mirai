# Troubleshooting Guide

This document addresses common issues that you might encounter when running the Email Automation system.

## Environment Variable Issues

### Error: "DefaultCredentialsError" or "Your default credentials were not found"

**Problem**: The application can't find valid Google API credentials.

**Solution**:
1. Make sure you have added your `GEMINI_API_KEY` to the `.env` file
2. The key should start with "AIza" followed by a series of characters
3. Obtain a valid API key from [Google AI Studio](https://ai.google.dev/)
4. Restart the application after updating the `.env` file

### Error: "OSError: Invalid argument" when loading environment variables

**Problem**: There might be encoding issues or invalid characters in your `.env` file.

**Solution**:
1. Delete the current `.env` file
2. Create a new `.env` file with a simple text editor (Notepad, VS Code)
3. Copy the contents from `.env.example` and add your API keys
4. Make sure there are no special characters or BOM markers in the file
5. Use simple ASCII characters only

## API Authentication Issues

### Groq API Issues

**Problem**: Unable to connect to Groq API for Llama model access.

**Solution**:
1. Check that your `GROQ_API_KEY` is valid and active
2. Make sure your API key starts with "gsk_" followed by a series of characters
3. The application will fall back to Gemini if Groq is unavailable
4. If issues persist, obtain a new API key from [Groq](https://console.groq.com/keys)

### Google Gemini API Issues

**Problem**: Unable to connect to Google Gemini API.

**Solution**:
1. Verify that your `GEMINI_API_KEY` is valid and not expired
2. Check that the API key has access to the Gemini API
3. Ensure you're using the correct model names ("gemini-1.5-flash" etc.)

## Database Issues

### Vector Database Errors

**Problem**: Errors related to the Chroma database or vector embeddings.

**Solution**:
1. Run `python create_index.py` to rebuild the vector index
2. Make sure your `GEMINI_API_KEY` is valid for embeddings access
3. Check that you have the `data/agency.txt` file with content
4. If the database is corrupted, delete the `db/` folder and rebuild the index

### "No such table" Chroma DB Error

**Problem**: Database schema issues with ChromaDB.

**Solution**:
1. Delete the `db/` directory and its contents
2. Run `python create_index.py` to rebuild the database from scratch

## Gmail API Issues

### Gmail Authentication Errors

**Problem**: Unable to access Gmail or authentication failures.

**Solution**:
1. Check that your `credentials.json` file exists in the project root
2. Follow the instructions in `GMAIL_SETUP.md` to set up Gmail API access
3. Make sure your `MY_EMAIL` environment variable matches the authenticated Gmail account
4. Delete `token.json` and restart to go through the authentication flow again

## Module Not Found Errors

**Problem**: ImportError or ModuleNotFoundError when running the application.

**Solution**:
1. Make sure you've installed all dependencies with `pip install -r requirements.txt`
2. Use the correct version of Python (3.7+)
3. Check for conflicts with existing packages in your environment
4. Consider using a fresh virtual environment

## Performance Issues

**Problem**: Slow responses or timeouts.

**Solution**:
1. Check your internet connection
2. Verify that both API services (Google and Groq) are operational
3. Consider reducing the batch size for marketing campaigns
4. Add timeouts to API calls in the code if needed

## General Troubleshooting Steps

1. Check the `.env` file for correct API keys
2. Ensure all required files exist (`credentials.json`, `data/agency.txt`, etc.)
3. Rebuild the vector index with `python create_index.py`
4. Clean up processed files with `python cleanup_repo.py`
5. Restart the application with a fresh environment

If you continue to experience issues, please open an issue on the repository or contact the maintainer.
