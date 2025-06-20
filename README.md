# Mirai - AI Marketing Platform

Transform your marketing with AI precision. Mirai automates your entire marketing workflow with AI, from content creation to customer engagement, saving 80% of your time and resources.

## 🚀 Quick Start

### Prerequisites\
dnds

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16.0 or higher)
- [Git](https://git-scm.com/)
- A code editor like [VS Code](https://code.visualstudio.com/)

### 📥 Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/mirai.git

# Navigate to the project directory
cd mirai
```

### 📦 Installation

Install the project dependencies:

```bash
# Install dependencies
npm install

# Or using yarn
yarn install
```

### 🏃‍♂️ Running the Application

Start the development server:

```bash
# Start development server
npm run dev

# Or using yarn
yarn dev
```

The application will be available at `http://localhost:5173`

### 🏗️ Build for Production

Create a production build:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Development Workflow

### 📚 Git Commands - Complete Guide

#### 🎯 First Time Setup
```bash
# Configure your identity (do this once)
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"

# Check your configuration
git config --list

# Initialize a new repository
git init

# Connect to remote repository
git remote add origin https://github.com/username/mirai.git
```

#### 📋 Basic Commands - Daily Use

##### Check Status & Information
```bash
# See what's changed in your project
git status

# See detailed changes in files
git diff                     # Changes not staged
git diff --staged           # Changes staged for commit

# View commit history
git log                     # Full history
git log --oneline          # Compact view
git log --graph            # Visual branch history
```

##### Adding & Committing Changes
```bash
# Add files to staging area
git add filename.txt        # Add specific file
git add .                   # Add all changed files
git add *.js               # Add all JavaScript files
git add src/               # Add entire directory

# Remove files from staging
git reset filename.txt      # Remove specific file from staging
git reset                  # Remove all files from staging

# Commit your changes
git commit -m "Your descriptive message"
git commit -m "Fix: Resolve login button issue"
git commit -m "Add: New dashboard component"

# Commit with detailed message
git commit -m "Title: Brief description

- Detailed explanation
- What was changed
- Why it was changed"
```

##### Working with Remote Repository
```bash
# Download latest changes from remote
git pull origin main        # Pull from main branch
git pull                   # Pull from current branch's remote

# Upload your changes to remote
git push origin main        # Push to main branch
git push                   # Push to current branch's remote
git push -u origin feature-name  # Push new branch and set upstream

# View remote repositories
git remote -v              # See all remotes
git remote show origin     # Detailed info about origin
```

#### 🌿 Branch Management

##### Creating & Switching Branches
```bash
# Create new branch
git branch feature-name     # Create branch
git checkout -b feature-name # Create and switch to branch
git switch -c feature-name  # Modern way to create and switch

# List branches
git branch                 # List local branches
git branch -r             # List remote branches
git branch -a             # List all branches

# Switch between branches
git checkout main          # Switch to main branch
git switch feature-name    # Switch to feature branch
```

##### Merging & Deleting Branches
```bash
# Merge branch into current branch
git checkout main          # Switch to main first
git merge feature-name     # Merge feature into main

# Delete branches
git branch -d feature-name              # Delete local branch (safe)
git branch -D feature-name              # Force delete local branch
git push origin --delete feature-name  # Delete remote branch
```

#### 🔄 Advanced Operations

##### Undoing Changes
```bash
# Undo changes in working directory
git checkout -- filename.txt    # Restore file to last commit
git restore filename.txt        # Modern way to restore file

# Undo commits
git reset --soft HEAD~1         # Undo last commit, keep changes staged
git reset HEAD~1               # Undo last commit, keep changes unstaged
git reset --hard HEAD~1        # Undo last commit, discard changes

# Revert a commit (safe for shared repos)
git revert commit-hash         # Create new commit that undoes changes
```

##### Stashing Changes
```bash
# Temporarily save changes
git stash                      # Stash current changes
git stash save "Work in progress on feature X"

# Apply stashed changes
git stash pop                  # Apply most recent stash and remove it
git stash apply               # Apply most recent stash and keep it

# Manage stashes
git stash list                # See all stashes
git stash drop               # Delete most recent stash
git stash clear              # Delete all stashes
```

##### Handling Conflicts
```bash
# When merge conflicts occur
git status                    # See conflicted files
# Edit files to resolve conflicts
git add resolved-file.txt     # Mark conflict as resolved
git commit                   # Complete the merge

# Abort merge if needed
git merge --abort            # Cancel the merge process
```

#### 🚨 Emergency Commands

##### When Things Go Wrong
```bash
# View what you did recently
git reflog                   # See all recent actions

# Recover lost commits
git reset --hard commit-hash # Go back to specific commit

# Clean up unwanted files
git clean -n                # See what would be deleted
git clean -f                # Delete untracked files

# Sync with remote when histories diverge
git pull origin main --allow-unrelated-histories
```

#### 📖 Common Workflows

##### Feature Development
```bash
# 1. Start new feature
git checkout main
git pull origin main
git checkout -b feature-new-login

# 2. Work on feature
git add .
git commit -m "Add login form"
git push -u origin feature-new-login

# 3. Merge feature
git checkout main
git pull origin main
git merge feature-new-login
git push origin main
git branch -d feature-new-login
```

##### Hotfix Workflow
```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix-critical-bug

# 2. Fix and deploy
git add .
git commit -m "Fix critical security issue"
git push -u origin hotfix-critical-bug

# 3. Merge to main
git checkout main
git merge hotfix-critical-bug
git push origin main
git branch -d hotfix-critical-bug
```

### NPM Commands

#### Package Management
```bash
# Install dependencies
npm install

# Install specific package
npm install package-name
npm install --save package-name          # Add to dependencies
npm install --save-dev package-name      # Add to devDependencies

# Uninstall package
npm uninstall package-name

# Update packages
npm update
npm outdated                 # Check for outdated packages
```

#### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run tests (if configured)
npm test
npm run test

# Clean node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📁 Project Structure

```
mirai/
├── public/                 # Static assets
├── src/                   # Source code
│   ├── assets/           # Images, icons, fonts
│   ├── components/       # Reusable React components
│   │   ├── navbar.jsx
│   │   ├── footer.jsx
│   │   └── script.js
│   ├── css/             # Stylesheets
│   │   ├── App.css
│   │   ├── login-styles.css
│   │   └── ...
│   ├── App.jsx          # Main App component
│   ├── Home.jsx         # Home page component
│   └── main.jsx         # Entry point
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # Project documentation
```

## 🎯 Features

- ✨ AI Product Photoshoot
- 💬 Marketing Chat Assistant
- 📞 Voice Sales Agent
- 📝 Content Generation
- 📧 Email Marketing Engine
- 📊 Competitor Analysis
- 🎨 Modern UI with animations
- 📱 Responsive design

## 🛠️ Technologies Used

- **Frontend:** React 18, Vite
- **Styling:** CSS3, Font Awesome icons
- **Routing:** React Router DOM
- **Build Tool:** Vite
- **Package Manager:** NPM

## 🚨 Troubleshooting

### Common Issues

1. **Module not found errors:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Git merge conflicts:**
   ```bash
   git pull origin main --allow-unrelated-histories
   ```

3. **Port already in use:**
   ```bash
   # Kill process on port 5173
   npx kill-port 5173
   # Or use a different port
   npm run dev -- --port 3000
   ```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, please reach out through:
- 📧 Email: support@mirai-ai.com
- 💬 Discord: [Join our community](https://discord.gg/mirai)
- 📝 Issues: [GitHub Issues](https://github.com/yourusername/mirai/issues)
- 📚 Documentation: [Wiki](https://github.com/yourusername/mirai/wiki)

---

**Happy coding! 🚀**