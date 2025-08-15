// ===== DEMO JAVASCRIPT FILE =====
// T.R.U.S.T. Argus Web Demo - Injury Detection Simulation

// Sample injury data for demo purposes
const INJURY_DATABASE = {
    'sample1.jpg': {
        injuryType: 'Laceration',
        confidence: '89%',
        severity: 'Moderate',
        icd10Code: 'S61.0',
        guidance: 'Clean the wound with sterile saline or clean water. Apply direct pressure to stop bleeding. Cover with sterile gauze and secure with medical tape. Monitor for signs of infection and seek medical attention if bleeding persists or wound shows signs of infection.',
        bodyPart: 'Hand',
        treatment: 'Wound cleaning, pressure dressing, tetanus prophylaxis if needed',
        followUp: '24-48 hours for wound assessment'
    },
    'sample2.jpg': {
        injuryType: 'Burn (Second Degree)',
        confidence: '92%',
        severity: 'Moderate to Severe',
        icd10Code: 'T23.1',
        guidance: 'Cool the burn with cool (not cold) water for 10-20 minutes. Do not apply ice. Cover with sterile, non-stick dressing. Do not pop blisters. Administer pain relief as needed. Seek immediate medical attention for burns larger than 3 inches or on face, hands, feet, or genitals.',
        bodyPart: 'Forearm',
        treatment: 'Cooling, sterile dressing, pain management',
        followUp: 'Immediate medical evaluation recommended'
    },

    'sample5.jpg': {
        injuryType: 'Cut (Abrasion)',
        confidence: '91%',
        severity: 'Mild to Moderate',
        icd10Code: 'S60.0',
        guidance: 'Clean the wound gently with soap and water or sterile saline. Apply antibiotic ointment if available. Cover with sterile bandage or gauze. Change dressing daily or when it becomes wet or dirty. Watch for signs of infection.',
        bodyPart: 'Finger',
        treatment: 'Wound cleaning, antibiotic ointment, bandaging',
        followUp: 'Daily dressing changes for 3-5 days'
    },

    'uploaded': {
        injuryType: 'Multiple Injuries Detected',
        confidence: '88%',
        severity: 'Moderate to Severe',
        icd10Code: 'T07',
        guidance: 'Multiple injury types detected. Assess for life-threatening conditions first (ABCs: Airway, Breathing, Circulation). Prioritize treatment based on severity. Document all injuries and seek comprehensive medical evaluation.',
        bodyPart: 'Multiple',
        treatment: 'Comprehensive assessment, stabilization, medical evaluation',
        followUp: 'Immediate medical evaluation recommended'
    },
    'default': {
        injuryType: 'Injury Detected',
        confidence: '85%',
        severity: 'Assessment Required',
        icd10Code: 'T07',
        guidance: 'An injury has been detected. Please ensure the patient is in a safe environment. Assess consciousness and breathing. If life-threatening conditions exist, call emergency services immediately. Document the injury and seek appropriate medical attention.',
        bodyPart: 'Multiple',
        treatment: 'Initial assessment, stabilization',
        followUp: 'Medical evaluation recommended'
    }
};

// Demo state management
let currentImage = null;
let isAnalyzing = false;
let injuryClassifier = null;

// Initialize demo when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 [EVENT LISTENER] Starting AI model preload...');
    preloadAIModel();
    
    // Initialize demo UI separately
    initDemoUI();
    
    // Initialize enhanced features
    enableQuickAnalysis();
    addKeyboardShortcuts();
    enhanceAccessibility();
    
    // Add demo reset button to demo controls
    addDemoResetButton();
});

// Preload AI model immediately when page loads
async function preloadAIModel() {
    console.log('🚀 [FUNCTION] Starting AI model preload...');
    updateAIStatus('loading', 'Loading AI Model...');
    
    try {
        injuryClassifier = new InjuryClassifier();
        const modelLoaded = await injuryClassifier.loadModel();
        
        if (modelLoaded) {
            console.log('✅ Injury classifier model loaded successfully');
            showNotification('AI Model Loaded: Ready for injury detection', 'success');
            
            // Update UI to show model is ready
            updateAIStatus('ready', 'AI Model Ready');
            enableAnalyzeButton();
            
            // Hide progress bar
            hideProgressBar();
        } else {
            console.warn('⚠️ Failed to load injury classifier model, using fallback');
            showNotification('Using fallback analysis mode', 'warning');
            updateAIStatus('error', 'AI Model Failed - Using Fallback');
            enableAnalyzeButton(); // Still enable button for fallback mode
            
            // Hide progress bar
            hideProgressBar();
        }
    } catch (error) {
        console.error('❌ Error loading injury classifier:', error);
        showNotification('Using fallback analysis mode', 'warning');
        updateAIStatus('error', 'AI Model Error - Using Fallback');
        enableAnalyzeButton(); // Still enable button for fallback mode
        
        // Hide progress bar
        hideProgressBar();
    }
}

// Initialize demo UI elements (separate from model loading)
function initDemoUI() {
    console.log('🔧 Initializing demo UI elements...');
    
    // Set up file upload handling
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Set up sample image handling
    setupSampleImages();
    
    // Initialize demo tracking
    trackDemoInteraction('demo_loaded');
}

// Helper functions for UI updates
function updateAIStatus(status, message) {
    const aiStatus = document.getElementById('aiStatus');
    if (aiStatus) {
        const statusIndicator = aiStatus.querySelector('.status-indicator');
        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${status}`;
            
            let icon = '';
            switch (status) {
                case 'loading':
                    icon = '<i class="fas fa-spinner fa-spin"></i>';
                    break;
                case 'ready':
                    icon = '<i class="fas fa-check-circle"></i>';
                    break;
                case 'error':
                    icon = '<i class="fas fa-exclamation-triangle"></i>';
                    break;
            }
            
            statusIndicator.innerHTML = `${icon} ${message}`;
        }
    }
}

function enableAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Image with AI';
    }
}

function hideProgressBar() {
    const progressBar = document.querySelector('.loading-progress');
    if (progressBar) {
        progressBar.style.display = 'none';
    }
}

// ===== FILE UPLOAD HANDLING =====

function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file.', 'error');
            return;
        }
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showNotification('Image file size must be less than 10MB.', 'error');
            return;
        }
        
        // Process the image
        processUploadedImage(file);
        
        // Track the interaction
        trackDemoInteraction('image_uploaded', { fileType: file.type, fileSize: file.size });
    }
}

function processUploadedImage(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageData = e.target.result;
        displayImage(imageData);
        
        // Simulate AI analysis as fallback
        simulateAnalysis('uploaded');
    };
    
    reader.readAsDataURL(file);
}

// ===== SAMPLE IMAGE HANDLING =====

function setupSampleImages() {
    const sampleImages = document.querySelectorAll('.sample-img');
    
    sampleImages.forEach(img => {
        img.addEventListener('click', function() {
            const sampleName = this.src.split('/').pop();
            loadSampleImage(sampleName);
        });
    });
}

function loadSampleImage(sampleName) {
    // In a real demo, you would load actual sample images
    // For this demo, we'll simulate the image loading
    const imageDisplay = document.getElementById('imageDisplay');
    
    // Create a placeholder image with the sample name
    const placeholderImage = createSamplePlaceholder(sampleName);
    
    // Clear previous content
    imageDisplay.innerHTML = '';
    imageDisplay.appendChild(placeholderImage);
    
    // Update current image
    currentImage = sampleName;
    
    // Simulate AI analysis as fallback
    simulateAnalysis('sample');
    
    // Track the interaction
    trackDemoInteraction('sample_image_selected', { sampleName });
}

function createSamplePlaceholder(sampleName) {
    const container = document.createElement('div');
    container.className = 'sample-placeholder';
    container.style.cssText = `
        width: 100%;
        height: 300px;
        background: linear-gradient(135deg, #29a9e1, #40e9a4);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
        padding: 2rem;
    `;
    
    container.innerHTML = `
        <i class="fas fa-image" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h3 style="margin-bottom: 0.5rem;">Sample Image</h3>
        <p style="font-size: 0.9rem; opacity: 0.9;">${sampleName}</p>
        <div style="margin-top: 1rem; padding: 0.5rem 1rem; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 0.8rem;">
            Using fallback analysis - click "Analyze Image" for real AI detection
        </div>
    `;
    
    return container;
}

// ===== IMAGE DISPLAY =====

function displayImage(imageData) {
    const imageDisplay = document.getElementById('imageDisplay');
    
    // Clear previous content
    imageDisplay.innerHTML = '';
    
    // Create image element
    const img = document.createElement('img');
    img.src = imageData;
    
    // Set initial styles for proper scaling
    img.style.cssText = `
        max-width: 100%;
        max-height: 400px;
        width: auto;
        height: auto;
        object-fit: contain;
        border-radius: 12px;
        display: block;
        margin: 0 auto;
    `;
    img.alt = 'Uploaded injury image';
    
    // Wait for image to load, then adjust sizing
    img.onload = function() {
        const displayHeight = 400; // Target display height
        const displayWidth = imageDisplay.clientWidth;
        
        // Calculate scaling to fit height while maintaining aspect ratio
        if (this.naturalHeight > displayHeight) {
            const scale = displayHeight / this.naturalHeight;
            const newWidth = this.naturalWidth * scale;
            
            // If scaled width fits within display width, use height-based scaling
            if (newWidth <= displayWidth) {
                this.style.height = `${displayHeight}px`;
                this.style.width = 'auto';
            } else {
                // Otherwise, scale to fit width
                this.style.width = '100%';
                this.style.height = 'auto';
            }
        } else {
            // Image is smaller than display height, show at natural size
            this.style.width = 'auto';
            this.style.height = 'auto';
        }
    };
    
    imageDisplay.appendChild(img);
    
    // Update current image
    currentImage = 'uploaded';
    
    // Show analysis button
    const analysisButton = document.querySelector('button[onclick="analyzeImage()"]');
    if (analysisButton) {
        analysisButton.disabled = false;
        analysisButton.textContent = '🔍 Analyze Image with AI';
    }
}

// ===== AI ANALYSIS SIMULATION =====

function simulateAnalysis(type) {
    // Simulate AI analysis for demo purposes
    const analysisTime = getAnalysisTime();
    
    setTimeout(() => {
        // Get injury data based on type
        let injuryData;
        
        if (type === 'uploaded') {
            // For uploaded images, randomly select from common injury types
            const commonInjuries = ['Laceration', 'Bruise (Contusion)', 'Cut (Abrasion)', 'Burn (Second Degree)', 'Fracture (Suspected)'];
            const randomInjury = commonInjuries[Math.floor(Math.random() * commonInjuries.length)];
            
            // Create dynamic injury data based on random selection
            injuryData = {
                injuryType: randomInjury,
                confidence: `${85 + Math.floor(Math.random() * 15)}%`,
                severity: getRandomSeverity(randomInjury),
                icd10Code: getICD10Code(randomInjury),
                guidance: getGuidance(randomInjury),
                bodyPart: getRandomBodyPart(),
                treatment: getTreatment(randomInjury),
                followUp: getFollowUp(randomInjury)
            };
        } else {
            injuryData = INJURY_DATABASE[type] || INJURY_DATABASE['default'];
        }
        
        // Display results
        displayAnalysisResults(injuryData);
        
        // Track the interaction
        trackDemoInteraction('analysis_completed', { 
            injuryType: injuryData.injuryType,
            confidence: injuryData.confidence,
            severity: injuryData.severity
        });
    }, analysisTime);
}

// Helper functions for dynamic injury generation
function getRandomSeverity(injuryType) {
    const severityMap = {
        'Laceration': ['Mild', 'Moderate', 'Severe'],
        'Bruise (Contusion)': ['Mild', 'Moderate'],
        'Cut (Abrasion)': ['Mild', 'Moderate'],
        'Burn (Second Degree)': ['Moderate', 'Moderate to Severe'],
        'Fracture (Suspected)': ['Severe', 'Critical']
    };
    
    const severities = severityMap[injuryType] || ['Mild', 'Moderate', 'Severe'];
    return severities[Math.floor(Math.random() * severities.length)];
}

function getICD10Code(injuryType) {
    const icd10Map = {
        'Laceration': 'S61.0',
        'Bruise (Contusion)': 'S60.0',
        'Cut (Abrasion)': 'S60.0',
        'Burn (Second Degree)': 'T23.1',
        'Fracture (Suspected)': 'S52.5'
    };
    
    return icd10Map[injuryType] || 'T07';
}

function getRandomBodyPart() {
    const bodyParts = ['Hand', 'Finger', 'Forearm', 'Face', 'Leg', 'Chest', 'Back', 'Shoulder'];
    return bodyParts[Math.floor(Math.random() * bodyParts.length)];
}

function getGuidance(injuryType) {
    // Use actual first aid guide enums from iOS app
    const guidanceMap = {
        'Laceration': [
            "1. Stop the Bleeding:",
            "• Apply direct pressure using clean cloth or gauze",
            "• Elevate wound above heart if possible", 
            "• Add more cloth if bleeding continues",
            "• Do not tie tourniquet unless absolutely necessary",
            "",
            "2. Clean the Wound:",
            "• Wash with cool or warm water",
            "• Use gentle soap if needed",
            "• Avoid alcohol or hydrogen peroxide",
            "",
            "3. Protect the Wound:",
            "• Apply sterile bandage",
            "• Change bandage daily or when wet",
            "• Monitor for signs of infection",
            "",
            "Seek Medical Attention if:",
            "• Wound is deep or jagged",
            "• Bleeding doesn't stop with pressure", 
            "• Signs of infection appear",
            "• Major artery or nerve involved"
        ].join('\n\n'),
        
        'Bruise (Contusion)': [
            "1. Apply ice pack for 15-20 minutes",
            "2. Elevate the affected area if possible",
            "3. Apply compression if swelling present",
            "4. Rest the injured area",
            "5. Monitor for signs of severe bruising",
            "6. Seek medical attention if severe pain persists"
        ].join('\n\n'),
        
        'Cut (Abrasion)': [
            "1. Clean the wound with soap and water",
            "2. Remove any debris with sterile tweezers",
            "3. Apply antiseptic solution",
            "4. Cover with sterile dressing", 
            "5. Monitor for signs of infection",
            "6. Change dressing daily"
        ].join('\n\n'),
        
        'Burn (Second Degree)': [
            "DO's:",
            "• Stop the burning process: cool with running cool (not cold) water for at least 5 minutes",
            "• Remove jewelry, watches, rings around burned area",
            "• Administer pain reliever (ibuprofen or acetaminophen)",
            "• Cover with sterile gauze bandage or clean cloth",
            "• Apply aloe vera lotion for small area burns",
            "",
            "DO NOT:",
            "• Do not apply ice – may cause further damage",
            "• Do not use butter, ointments or home remedies",
            "• Do not break blisters",
            "• Seek medical attention if burn is larger than victim's palm"
        ].join('\n\n'),
        
        'Fracture (Suspected)': [
            "1. Immobilize the injured area",
            "2. Apply ice pack to reduce swelling",
            "3. Keep the person still and comfortable",
            "4. Do not try to realign the bone",
            "5. Support the injury with padding",
            "6. Seek immediate medical attention"
        ].join('\n\n')
    };
    
    return guidanceMap[injuryType] || 'An injury has been detected. Please ensure the patient is in a safe environment and seek appropriate medical attention.';
}

function getTreatment(injuryType) {
    const treatmentMap = {
        'Laceration': 'Wound cleaning, pressure dressing, tetanus prophylaxis if needed',
        'Bruise (Contusion)': 'Ice therapy, rest, elevation',
        'Cut (Abrasion)': 'Wound cleaning, antibiotic ointment, bandaging',
        'Burn (Second Degree)': 'Cooling, sterile dressing, pain management',
        'Fracture (Suspected)': 'Immobilization, ice therapy, elevation'
    };
    
    return treatmentMap[injuryType] || 'Initial assessment, stabilization';
}

function getFollowUp(injuryType) {
    const followUpMap = {
        'Laceration': '24-48 hours for wound assessment',
        'Bruise (Contusion)': 'Monitor for 48-72 hours',
        'Cut (Abrasion)': 'Daily dressing changes for 3-5 days',
        'Burn (Second Degree)': 'Immediate medical evaluation recommended',
        'Fracture (Suspected)': 'Immediate medical evaluation required'
    };
    
    return followUpMap[injuryType] || 'Medical evaluation recommended';
}

// ===== AI ANALYSIS SIMULATION =====

async function analyzeImage() {
    if (!currentImage) {
        showNotification('Please upload an image or select a sample image first.', 'info');
        return;
    }
    
    if (isAnalyzing) {
        showNotification('Analysis already in progress...', 'info');
        return;
    }
    
    // Start analysis
    isAnalyzing = true;
    
    // Show loading state
    showAnalysisLoading();
    
    // Add safety timeout to prevent stuck analysis state
    const analysisTimeout = setTimeout(() => {
        if (isAnalyzing) {
            console.warn('⚠️ Analysis timeout - resetting state');
            hideAnalysisLoading();
            isAnalyzing = false;
            showNotification('Analysis timed out - please try again', 'warning');
        }
    }, 30000); // 30 second timeout
    
    try {
        // Try to use the real model first
        if (injuryClassifier && injuryClassifier.isLoaded) {
            console.log('🔍 Using real AI model for injury detection...');
            
            // Get the image element from the display
            const imageDisplay = document.getElementById('imageDisplay');
            const imageElement = imageDisplay.querySelector('img');
            
            if (imageElement) {
                try {
                    // Use the real model
                    console.log('🤖 Calling injuryClassifier.classifyImage...');
                    const results = await injuryClassifier.classifyImage(imageElement);
                    console.log('✅ Real model analysis successful:', results);
                    
                    // Hide loading overlay
                    hideAnalysisLoading();
                    
                    // Display results
                    displayAnalysisResults(results);
                    
                    // Track the interaction
                    trackDemoInteraction('analysis_completed', { 
                        injuryType: results.injuryType,
                        confidence: results.confidence,
                        severity: results.severity,
                        modelType: 'real'
                    });
                    
                    // Reset analysis state
                    isAnalyzing = false;
                    clearTimeout(analysisTimeout);
                    return; // Success, exit early
                } catch (modelError) {
                    console.error('❌ Real model analysis failed with error:', modelError);
                    console.error('🔍 Error message:', modelError.message);
                    console.error('📍 Error stack:', modelError.stack);
                    
                    // Show detailed error to user
                    showNotification(`AI Model Error: ${modelError.message}`, 'error');
                    
                    // Fall back to simulation since real model failed
                    console.log('⚠️ Falling back to simulation due to model error');
                    setTimeout(() => {
                        performAnalysis();
                    }, 1000);
                    return;
                }
            } else {
                throw new Error('No image found for analysis');
            }
        }
        
        // Fallback to simulated analysis if no real model
        console.log('⚠️ Using fallback analysis mode...');
        setTimeout(() => {
            performAnalysis();
        }, 2000 + Math.random() * 2000); // 2-4 seconds
        
    } catch (error) {
        console.error('❌ Error during analysis:', error);
        showNotification('Analysis failed, using fallback mode', 'warning');
        
        // Fallback to simulated analysis
        setTimeout(() => {
            performAnalysis();
        }, 2000 + Math.random() * 2000);
    }
    
    // Track the interaction
    trackDemoInteraction('analysis_started', { imageType: currentImage });
}

function showAnalysisLoading() {
    const imageDisplay = document.getElementById('imageDisplay');
    
    // Add loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'analysis-loading';
    loadingOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(41, 169, 225, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        border-radius: 12px;
        z-index: 10;
    `;
    
    loadingOverlay.innerHTML = `
        <div class="loading-spinner" style="
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        "></div>
        <h3 style="margin-bottom: 0.5rem;">AI Analysis in Progress</h3>
        <p style="text-align: center; opacity: 0.9;">
            Analyzing image for injury detection...<br>
            <small>Processing medical data and protocols</small>
        </p>
    `;
    
    // Make image display relative for absolute positioning
    imageDisplay.style.position = 'relative';
    imageDisplay.appendChild(loadingOverlay);
    
    // Add CSS animation for spinner
    if (!document.querySelector('#loading-spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-spinner-styles';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function hideAnalysisLoading() {
    const loadingOverlay = document.querySelector('.analysis-loading');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

function performAnalysis() {
    // Remove loading overlay
    const loadingOverlay = document.querySelector('.analysis-loading');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
    
    // Get injury data based on current image
    const injuryData = INJURY_DATABASE[currentImage] || INJURY_DATABASE['default'];
    
    // Display results
    displayAnalysisResults(injuryData);
    
    // Track the interaction
    trackDemoInteraction('analysis_completed', { 
        injuryType: injuryData.injuryType,
        confidence: injuryData.confidence,
        severity: injuryData.severity
    });
}

// ===== RESULTS DISPLAY =====

function displayAnalysisResults(injuryData) {
    const analysisResults = document.getElementById('analysisResults');
    
    // Update result values
    document.getElementById('injuryType').textContent = injuryData.injuryType;
    document.getElementById('confidence').textContent = injuryData.confidence;
    document.getElementById('severity').textContent = injuryData.severity;
    document.getElementById('icd10Code').textContent = injuryData.icd10Code;
    
    // Update medical guidance
    document.getElementById('guidanceText').textContent = injuryData.guidance;
    
    // Show results
    analysisResults.classList.remove('hidden');
    
    // Add success animation
    analysisResults.style.animation = 'fadeInUp 0.8s ease-out';
    
    // Scroll to results
    analysisResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Show success notification
    showNotification(`Injury detected: ${injuryData.injuryType}`, 'success');
}

// ===== DEMO ENHANCEMENTS =====

// Add realistic analysis variations
function addAnalysisVariations() {
    // Simulate different confidence levels based on image quality
    const baseConfidence = 85;
    const variation = Math.floor(Math.random() * 15); // ±7%
    
    return Math.max(70, Math.min(98, baseConfidence + variation));
}

// Simulate different analysis times
function getAnalysisTime() {
    const baseTime = 2000;
    const variation = Math.random() * 2000; // ±1 second
    
    return baseTime + variation;
}

// ===== INTERACTIVE FEATURES =====

// Add click-to-analyze functionality for sample images
function enableQuickAnalysis() {
    const sampleImages = document.querySelectorAll('.sample-img');
    
    sampleImages.forEach(img => {
        img.addEventListener('dblclick', function() {
            const sampleName = this.src.split('/').pop();
            loadSampleImage(sampleName);
            
            // Auto-analyze after a short delay
            setTimeout(() => {
                analyzeImage();
            }, 500);
        });
        
        // Add tooltip
        img.title = 'Click to select, double-click to auto-analyze';
    });
}

// Add keyboard shortcuts
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to analyze
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            analyzeImage();
        }
        
        // Space to upload new image
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault();
            document.getElementById('imageUpload').click();
        }
    });
}

// ===== DEMO STATISTICS =====

let demoStats = {
    imagesAnalyzed: 0,
    totalAnalysisTime: 0,
    mostCommonInjury: null,
    averageConfidence: 0
};

function updateDemoStats(injuryData) {
    demoStats.imagesAnalyzed++;
    demoStats.totalAnalysisTime += getAnalysisTime();
    
    // Update average confidence
    const currentTotal = demoStats.averageConfidence * (demoStats.imagesAnalyzed - 1);
    const newConfidence = parseInt(injuryData.confidence);
    demoStats.averageConfidence = (currentTotal + newConfidence) / demoStats.imagesAnalyzed;
    
    // Track most common injury (simplified)
    if (!demoStats.mostCommonInjury) {
        demoStats.mostCommonInjury = injuryData.injuryType;
    }
    
    // Display stats if needed
    displayDemoStats();
}

function displayDemoStats() {
    // This could be displayed in a stats panel
    console.log('Demo Statistics:', demoStats);
}

// ===== ERROR HANDLING =====

function handleAnalysisError(error) {
    console.error('Analysis error:', error);
    
    // Show user-friendly error message
    showNotification('Analysis failed. Please try again with a different image.', 'error');
    
    // Reset analysis state
    isAnalyzing = false;
    
    // Remove loading overlay if present
    const loadingOverlay = document.querySelector('.analysis-loading');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
    
    // Track the error
    trackDemoInteraction('analysis_error', { error: error.message });
}

// ===== DEMO RESET =====

function resetDemo() {
    // Clear current image
    currentImage = null;
    
    // Reset analysis state
    isAnalyzing = false;
    
    // Clear image display
    const imageDisplay = document.getElementById('imageDisplay');
    imageDisplay.innerHTML = `
        <div class="placeholder-content">
            <i class="fas fa-camera"></i>
            <p>Upload an image to begin analysis</p>
        </div>
    `;
    
    // Hide results
    const analysisResults = document.getElementById('analysisResults');
    analysisResults.classList.add('hidden');
    
    // Reset file input
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Track the reset
    trackDemoInteraction('demo_reset');
    
    showNotification('Demo reset successfully.', 'info');
}

// ===== ACCESSIBILITY IMPROVEMENTS =====

function enhanceAccessibility() {
    // Add ARIA labels
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.setAttribute('aria-label', 'Upload injury image for AI analysis');
    }
    
    // Add role attributes
    const analysisResults = document.getElementById('analysisResults');
    if (analysisResults) {
        analysisResults.setAttribute('role', 'region');
        analysisResults.setAttribute('aria-label', 'AI Analysis Results');
    }
    
    // Add live regions for dynamic content
    const guidanceText = document.getElementById('guidanceText');
    if (guidanceText) {
        guidanceText.setAttribute('aria-live', 'polite');
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Debounce image analysis to prevent rapid successive calls
const debouncedAnalyze = debounce(analyzeImage, 500);

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== INITIALIZATION =====

function addDemoResetButton() {
    const demoControls = document.querySelector('.demo-controls');
    
    if (demoControls) {
        const resetButton = document.createElement('button');
        resetButton.className = 'btn btn-secondary';
        resetButton.style.marginTop = '1rem';
        resetButton.innerHTML = '<i class="fas fa-redo"></i> Reset Demo';
        resetButton.onclick = resetDemo;
        
        demoControls.appendChild(resetButton);
    }
}

// ===== EXPORT FUNCTIONS =====

// Make functions available globally for the demo
window.TRUSTArgusDemo = window.TRUSTArgusDemo || {};
window.TRUSTArgusDemo.analyzeImage = analyzeImage;
window.TRUSTArgusDemo.loadSampleImage = loadSampleImage;
window.TRUSTArgusDemo.resetDemo = resetDemo;
window.TRUSTArgusDemo.getDemoStats = () => demoStats;
