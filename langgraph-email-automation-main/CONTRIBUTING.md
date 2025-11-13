# Contributing to Email Automation with LangGraph

Thank you for considering contributing to our Email Automation project! This document outlines the process and guidelines for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

1. **Fork the Repository**: Start by forking the repository to your GitHub account.

2. **Clone Your Fork**: 
   ```bash
   git clone https://github.com/YOUR-USERNAME/langgraph-email-automation.git
   ```

3. **Create a New Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Set Up Development Environment**:
   - Create a virtual environment
   - Install dependencies from requirements.txt
   - Copy .env.example to .env and fill in your API keys

5. **Make Your Changes**: 
   - Follow the coding style of the project
   - Add comments where necessary
   - Update documentation if needed

6. **Run Tests**: Ensure your changes don't break existing functionality.

7. **Clean Up**: Run the cleanup script before committing:
   ```bash
   python cleanup_repo.py
   ```

8. **Commit Your Changes**:
   ```bash
   git commit -m "Brief description of your changes"
   ```

9. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

10. **Submit a Pull Request**: Go to the original repository and submit a pull request.

## Pull Request Guidelines

- Describe what your changes do and why they should be included
- Include any relevant issue numbers
- Make sure your code follows the project's style
- Ensure all tests pass
- Keep pull requests focused on a single topic

## Development Guidelines

### Code Style

- Follow PEP 8 guidelines for Python code
- Use meaningful variable and function names
- Include docstrings for functions and classes

### Documentation

- Update the README.md if your changes affect how users interact with the project
- Document new features thoroughly

### Git Workflow

- Keep commits focused and atomic
- Write clear commit messages

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

Thank you for contributing to make this project better!
