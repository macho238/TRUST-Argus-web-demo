# GitHub Pages Deployment Guide

This guide will walk you through deploying the T.R.U.S.T. Argus web demo to GitHub Pages.

## 🚀 Quick Start

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name: `trust-argus-web-demo` (or your preferred name)
4. Description: "T.R.U.S.T. Argus AI Injury Detection Web Demo"
5. Make it **Public** (required for free GitHub Pages)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### 2. Upload Files

#### Option A: Using GitHub Desktop (Recommended)
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Clone the repository to your local machine
3. Copy all files from `web-demo/` folder to the cloned repository
4. Commit and push changes

#### Option B: Using Git Command Line
```bash
# Navigate to your project directory
cd /path/to/TRUSTArgus1.2

# Initialize git in web-demo folder
cd web-demo
git init
git add .
git commit -m "Initial commit: T.R.U.S.T. Argus web demo"

# Add remote and push
git remote add origin https://github.com/[username]/trust-argus-web-demo.git
git branch -M main
git push -u origin main
```

#### Option C: Drag & Drop (Quick Test)
1. In your GitHub repository, click "uploading an existing file"
2. Drag and drop all files from the `web-demo/` folder
3. Add commit message: "Initial commit: T.R.U.S.T. Argus web demo"
4. Click "Commit changes"

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section (left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Click "Save"
7. Wait 2-5 minutes for deployment

### 4. Access Your Demo

Your demo will be available at:
```
https://[username].github.io/trust-argus-web-demo/
```

## 📁 Required Files Structure

Ensure these files are in your repository root:

```
trust-argus-web-demo/
├── index.html              # Main demo page
├── assets/                 # Images and icons
│   ├── samples/           # Sample injury photos
│   ├── darkMode3.png      # Hero mockup
│   └── [other assets]
├── styles/                 # CSS files
│   ├── main.css
│   └── responsive.css
├── scripts/                # JavaScript files
│   ├── main.js
│   ├── demo.js
│   └── injury_classifier.js
├── tensorflowjs_model/     # AI model files
│   ├── model.json
│   ├── group1-shard1of3.bin
│   ├── group1-shard2of3.bin
│   └── group1-shard3of3.bin
├── README.md              # Project documentation
└── .gitignore             # Git ignore rules
```

## 🔧 Troubleshooting

### Common Issues:

1. **404 Error**: Ensure all files are in the root directory, not in subfolders
2. **Model Not Loading**: Check that `tensorflowjs_model/` folder contains all model files
3. **Styling Issues**: Verify CSS files are properly linked in `index.html`
4. **JavaScript Errors**: Check browser console for any script loading issues

### Testing Locally First:

```bash
cd web-demo
python3 -m http.server 8000
# Open http://localhost:8000 in browser
```

## 🌐 Next Steps After Deployment

1. **Test the Demo**: Ensure all functionality works on the live site
2. **Embed in Wix**: Use the GitHub Pages URL in your Wix iframe
3. **Share**: Send the demo URL to stakeholders and testers
4. **Monitor**: Check GitHub Pages analytics for visitor data

## 📱 Wix Integration

Once deployed, you can embed the demo in Wix using:

1. **HTML Widget**: Add an HTML widget to your Wix page
2. **Iframe Code**: Use this HTML:
```html
<iframe 
  src="https://[username].github.io/trust-argus-web-demo/" 
  width="100%" 
  height="800px" 
  frameborder="0"
  scrolling="yes">
</iframe>
```

3. **Responsive Settings**: Adjust width/height for mobile compatibility

## 🎯 Success Checklist

- [ ] Repository created and files uploaded
- [ ] GitHub Pages enabled and deployed
- [ ] Demo accessible via GitHub Pages URL
- [ ] All functionality working (image upload, AI detection, medical guidance)
- [ ] Responsive design working on mobile/tablet
- [ ] Ready for Wix iframe integration

---

**Need Help?** Check GitHub's [GitHub Pages documentation](https://docs.github.com/en/pages) or create an issue in your repository.
