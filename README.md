# T.R.U.S.T. Argus Web Demo

A web-based demonstration of the T.R.U.S.T. Argus AI injury detection system, showcasing real-time injury classification using TensorFlow.js.

## 🚀 Live Demo

**Demo URL**: [Your GitHub Pages URL will go here]

## ✨ Features

- **Real-time AI Injury Detection**: Uses trained TensorFlow.js model for accurate injury classification
- **10 Injury Types**: Detects abrasions, burns, cuts, fractures, gunshot wounds, lacerations, and more
- **Medical Guidance**: Provides detailed first aid steps for each injury type
- **Multi-language Support**: Supports 9 languages for global accessibility
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🏥 Injury Types Detected

1. **Abrasion** - Minor skin scrapes and abrasions
2. **Amputation** - Limb or digit amputations
3. **Bleeding** - Various types of bleeding injuries
4. **Bruise** - Contusions and bruising
5. **Burn** - Thermal injuries (1st, 2nd, 3rd degree)
6. **Cut** - Incised wounds and lacerations
7. **Fracture** - Bone fractures and breaks
8. **Gunshot** - Firearm-related injuries
9. **Laceration** - Deep cuts and tears
10. **Puncture** - Penetrating wounds

## 🛠️ Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Model**: TensorFlow.js with custom-trained CNN
- **Model Architecture**: Convolutional Neural Network (CNN)
- **Input Size**: 299x299 pixels
- **Training Data**: 483+ medical injury images
- **Accuracy**: Medical-grade classification performance

## 📁 Project Structure

```
web-demo/
├── index.html              # Main demo page
├── assets/                 # Images, icons, and sample photos
├── styles/                 # CSS styling files
├── scripts/                # JavaScript functionality
├── tensorflowjs_model/     # AI model files
└── README.md              # This file
```

## 🚀 Deployment

This demo is designed for GitHub Pages deployment. Simply:

1. Push this repository to GitHub
2. Enable GitHub Pages in repository settings
3. Set source to main branch
4. Access via `https://[username].github.io/[repo-name]`

## 🔧 Local Development

For local testing:

```bash
# Navigate to web-demo directory
cd web-demo

# Start local server (Python 3)
python3 -m http.server 8000

# Access at http://localhost:8000
```

## 📱 Usage

1. **Upload Image**: Drag & drop or click to upload injury photos
2. **Sample Images**: Try pre-loaded sample images for testing
3. **AI Analysis**: Real-time injury detection and classification
4. **Medical Guidance**: View detailed first aid instructions
5. **Severity Assessment**: Get injury severity and ICD-10 codes

## 🏥 Medical Disclaimer

This is a demonstration system and should not be used for actual medical diagnosis or treatment. Always consult qualified medical professionals for medical emergencies.

## 🤝 Contributing

This demo is part of the T.R.U.S.T. Argus project. For contributions or questions, please refer to the main project repository.

## 📄 License

Part of the T.R.U.S.T. Argus project. All rights reserved.

---

**T.R.U.S.T. Argus** - Trauma Response Universal Safety Transcriber  
*Revolutionary AI-Powered Emergency Response Technology*
