# 🚀 Deploying CaMeL Security Demo to GitHub Pages

This guide will help you deploy your CaMeL Security Demo to GitHub Pages using GitHub Actions for automatic deployment.

## 📋 Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Repository**: Your code should be in a GitHub repository
3. **GitHub Pages Enabled**: We'll enable this during setup

## 🔧 Setup Steps

### 1. Create a New GitHub Repository

Since the GitHub MCP doesn't have permission to create repositories, you'll need to:

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it: `camel-security` (this is important for the custom domain)
5. Make it **Public** (required for free GitHub Pages)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### 2. Push Your Code to GitHub

```bash
# Add GitHub as a remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/camel-security.git

# Push your code to GitHub
git add .
git commit -m "Initial commit: CaMeL Security Demo"
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. This will use the workflow file we created (`.github/workflows/deploy.yml`)

### 4. Configure GitHub Pages Settings

1. In the **Pages** settings, ensure:
   - **Source**: GitHub Actions
   - **Branch**: This will be handled automatically by the workflow

## 🚀 Automatic Deployment

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:

1. **Build** your React app when you push to `main` or `master`
2. **Deploy** to GitHub Pages
3. **Cache** dependencies for faster builds

### What Happens on Each Push:

1. **Build Job**: 
   - Installs dependencies
   - Builds the React app
   - Creates artifacts

2. **Deploy Job**:
   - Deploys to GitHub Pages
   - Provides deployment URL

## 📱 Access Your App

After deployment, your app will be available at:
```
https://camel-security.github.io/
```

**Note:** This uses a custom domain setup. Make sure you have:
1. A repository named `camel-security` (not `camel-security-demo`)
2. Proper DNS configuration for the custom domain
3. GitHub Pages enabled with custom domain support

## 🔄 Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build locally
npm run build

# Create a new branch for Pages
git checkout -b gh-pages

# Remove everything except build files
git rm -rf .
git checkout main -- build/

# Move build files to root
mv build/* .
rmdir build

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Set Pages source to 'gh-pages' branch in GitHub settings
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Fails**: Check the Actions tab for workflow logs
2. **Pages Not Loading**: Ensure Pages is enabled and source is set to GitHub Actions
3. **Routing Issues**: The build process handles SPA routing correctly

### Check Deployment Status:

1. Go to **Actions** tab in your repository
2. View the latest workflow run
3. Check for any errors in the build or deploy steps

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [React Build Optimization](https://create-react-app.dev/docs/optimization)

## 🎯 Next Steps

After successful deployment:

1. **Test** your app thoroughly at the Pages URL
2. **Share** the Pages URL with others
3. **Monitor** the Actions tab for future deployments
4. **Customize** the domain if needed (GitHub Premium feature)

## 🔐 Security Note

Since this is a security demonstration app, consider:
- Making the repository private if you prefer
- Adding security headers to your app
- Monitoring for any security-related issues

Your CaMeL Security Demo will now be accessible to anyone with the Pages URL! 🐪🛡️

## 📝 Repository Structure

Your repository should now contain:
```
camel-security-demo/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/
│   ├── camel-favicon.svg       # Custom camel favicon
│   ├── index.html              # Main HTML file
│   └── manifest.json           # Web app manifest
├── src/                        # React source code
├── .gitignore                  # Git ignore file
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

The GitHub Actions workflow will automatically build and deploy your app whenever you push changes to the main branch!
