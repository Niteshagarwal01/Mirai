# Makefile for Email Automation Project

# Default Python interpreter
PYTHON = python
VENV = venv
PIP = $(VENV)/bin/pip
PYTHON_VENV = $(VENV)/bin/python

ifeq ($(OS),Windows_NT)
	# Windows
	VENV_ACTIVATE = $(VENV)/Scripts/activate
	PIP = $(VENV)/Scripts/pip
	PYTHON_VENV = $(VENV)/Scripts/python
else
	# Linux/Mac
	VENV_ACTIVATE = $(VENV)/bin/activate
	PIP = $(VENV)/bin/pip
	PYTHON_VENV = $(VENV)/bin/python
endif

.PHONY: help setup env install clean run deploy-api marketing test

help:
	@echo "Available commands:"
	@echo "  setup         - Setup the project (virtual environment and dependencies)"
	@echo "  env           - Create virtual environment only"
	@echo "  install       - Install dependencies in existing virtual environment"
	@echo "  clean         - Clean up __pycache__, processed data files, etc."
	@echo "  clean-all     - Full cleanup including DB directories"
	@echo "  run           - Run the main application"
	@echo "  deploy-api    - Run the API server"
	@echo "  marketing     - Run the marketing campaign"
	@echo "  create-index  - Create the vector index from documents"
	@echo "  clear-leads   - Clear the processed leads file"

setup:
	$(PYTHON) setup.py

env:
	$(PYTHON) -m venv $(VENV)
	@echo "Virtual environment created. Activate with:"
	@echo "  source $(VENV_ACTIVATE)  # Linux/Mac"
	@echo "  $(VENV_ACTIVATE)  # Windows"

install:
	$(PIP) install -r requirements.txt

clean:
	$(PYTHON) cleanup_repo.py

clean-all:
	$(PYTHON) cleanup_repo.py --all

run:
	$(PYTHON_VENV) main.py

deploy-api:
	$(PYTHON_VENV) deploy_api.py

marketing:
	$(PYTHON_VENV) run_marketing_campaign.py

create-index:
	$(PYTHON_VENV) create_index.py

clear-leads:
	$(PYTHON_VENV) clear_processed_leads.py
