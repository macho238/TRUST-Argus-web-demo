// T.R.U.S.T. Argus Injury Classifier - Web Integration
// This file integrates the TensorFlow.js model with the web demo

class InjuryClassifier {
    constructor() {
        this.model = null;
        this.classes = ["Abrasion", "Amputation", "Bleeding", "Bruise", "Burn", "Cut", "GunShot", "Laceration", "PunctureWound", "HealthyPerson"];
        this.isLoaded = false;
        this.isAnalyzing = false;
    }
    
    async loadModel() {
        try {
            console.log('🚀 Loading injury classification model...');
            console.log('📁 Model path: tensorflowjs_model/model.json');
            
            // Check if TensorFlow.js is available
            if (typeof tf === 'undefined') {
                throw new Error('TensorFlow.js not loaded');
            }
            
            console.log('✅ TensorFlow.js is available');
            console.log('🔍 TensorFlow version:', tf.version);
            
            // Check if the model files exist
            try {
                const modelResponse = await fetch('tensorflowjs_model/model.json');
                if (!modelResponse.ok) {
                    throw new Error(`Model file not found: ${modelResponse.status} ${modelResponse.statusText}`);
                }
                console.log('✅ Model.json file found and accessible');
            } catch (fetchError) {
                throw new Error(`Cannot access model.json: ${fetchError.message}`);
            }
            
            this.model = await tf.loadGraphModel('tensorflowjs_model/model.json');
            this.isLoaded = true;
            console.log('✅ Model loaded successfully');
            
            // Try to get model info (graph models don't have summary)
            try {
                console.log('📊 Model inputs:', this.model.inputs);
                console.log('📊 Model outputs:', this.model.outputs);
            } catch (infoError) {
                console.log('⚠️ Could not get model info, but model loaded successfully');
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error loading model:', error);
            console.error('🔍 Error details:', error.message);
            console.error('📍 Error stack:', error.stack);
            return false;
        }
    }
    
    async classifyImage(imageElement) {
        if (!this.isLoaded) {
            throw new Error('Model not loaded');
        }
        
        if (this.isAnalyzing) {
            throw new Error('Analysis already in progress');
        }
        
        this.isAnalyzing = true;
        
        try {
            console.log('🔍 Starting image classification...');
            
            // Preprocess image
            console.log('📸 Preprocessing image...');
            const tensor = tf.browser.fromPixels(imageElement);
            console.log('✅ Image converted to tensor:', tensor.shape);
            
            const resized = tf.image.resizeBilinear(tensor, [299, 299]);
            console.log('✅ Image resized to 299x299');
            
            const expanded = resized.expandDims(0);
            console.log('✅ Added batch dimension:', expanded.shape);
            
            const normalized = expanded.div(255.0);
            console.log('✅ Image normalized to [0,1] range');
            
            // Make prediction with graph model
            console.log('🤖 Running model prediction...');
            console.log('📤 Input tensor shape:', normalized.shape);
            console.log('📤 Input tensor name: conv2d_input');
            
            const predictions = await this.model.executeAsync({conv2d_input: normalized});
            console.log('✅ Model prediction completed');
            console.log('📊 Prediction tensor:', predictions);
            
            const predictionArray = await predictions.array();
            console.log('✅ Prediction converted to array:', predictionArray);
            console.log('📊 Prediction array shape:', predictionArray[0].length);
            console.log('📊 Prediction values:', predictionArray[0]);
            
            // Clean up tensors
            console.log('🧹 Cleaning up tensors...');
            tensor.dispose();
            resized.dispose();
            expanded.dispose();
            normalized.dispose();
            predictions.dispose();
            console.log('✅ Tensors cleaned up');
            
            // Process results
            console.log('🔄 Processing prediction results...');
            const results = this.processPredictions(predictionArray[0]);
            console.log('✅ Results processed:', results);
            
            this.isAnalyzing = false;
            return results;
            
        } catch (error) {
            console.error('❌ Error during image classification:', error);
            console.error('🔍 Error details:', error.message);
            console.error('📍 Error stack:', error.stack);
            this.isAnalyzing = false;
            throw error;
        }
    }
    
    processPredictions(predictions) {
        // Find the highest confidence prediction
        const maxIndex = predictions.indexOf(Math.max(...predictions));
        const confidence = predictions[maxIndex];
        const injuryType = this.classes[maxIndex];
        
        // Create detailed results
        const results = {
            injuryType: injuryType,
            confidence: `${(confidence * 100).toFixed(1)}%`,
            severity: this.getSeverity(injuryType, confidence),
            icd10Code: this.getICD10Code(injuryType),
            guidance: this.getGuidance(injuryType),
            bodyPart: this.getRandomBodyPart(),
            treatment: this.getTreatment(injuryType),
            followUp: this.getFollowUp(injuryType),
            allPredictions: predictions.map((p, i) => ({
                class: this.classes[i],
                confidence: `${(p * 100).toFixed(1)}%`
            }))
        };
        
        return results;
    }
    
    getSeverity(injuryType, confidence) {
        const severityMap = {
            'Abrasion': ['Mild', 'Moderate'],
            'Amputation': ['Critical', 'Severe'],
            'Bleeding': ['Mild', 'Moderate', 'Severe'],
            'Bruise': ['Mild', 'Moderate'],
            'Burn': ['Moderate', 'Moderate to Severe'],
            'Cut': ['Mild', 'Moderate'],
            'GunShot': ['Critical', 'Severe'],
            'Laceration': ['Mild', 'Moderate', 'Severe'],
            'PunctureWound': ['Moderate', 'Severe'],
            'HealthyPerson': ['Normal']
        };
        
        const severities = severityMap[injuryType] || ['Assessment Required'];
        return severities[Math.floor(Math.random() * severities.length)];
    }
    
    getICD10Code(injuryType) {
        const icd10Map = {
            'Abrasion': 'S30.0',
            'Amputation': 'S68.0',
            'Bleeding': 'R58.0',
            'Bruise': 'S00.0',
            'Burn': 'T23.1',
            'Cut': 'S60.0',
            'GunShot': 'X93',
            'Laceration': 'S61.0',
            'PunctureWound': 'S61.1',
            'HealthyPerson': 'Z00.0'
        };
        
        return icd10Map[injuryType] || 'T07';
    }
    
    getRandomBodyPart() {
        const bodyParts = ['Hand', 'Finger', 'Forearm', 'Face', 'Leg', 'Chest', 'Back', 'Shoulder'];
        return bodyParts[Math.floor(Math.random() * bodyParts.length)];
    }
    
    getGuidance(injuryType) {
        // Use actual first aid guide enums from iOS app
        const guidanceMap = {
            'Abrasion': [
                "1. Clean the wound with soap and water",
                "2. Remove any debris with sterile tweezers", 
                "3. Apply antiseptic solution",
                "4. Cover with sterile dressing",
                "5. Monitor for signs of infection",
                "6. Change dressing daily"
            ].join('\n\n'),
            
            'Amputation': [
                "IMMEDIATE EMERGENCY RESPONSE REQUIRED",
                "1. Call 911 immediately",
                "2. Apply direct pressure to stop bleeding",
                "3. Preserve the amputated part if possible",
                "4. Keep the amputated part cool but not frozen",
                "5. Transport to hospital immediately"
            ].join('\n\n'),
            
            'Bleeding': [
                "1. Apply direct pressure to stop bleeding",
                "2. Use sterile gauze or clean cloth",
                "3. Elevate the affected area if possible",
                "4. Apply pressure bandage if needed",
                "5. Seek medical attention if bleeding persists",
                "6. Monitor for signs of shock"
            ].join('\n\n'),
            
            'Bruise': [
                "1. Apply ice pack for 15-20 minutes",
                "2. Elevate the affected area if possible",
                "3. Apply compression if swelling present",
                "4. Rest the injured area",
                "5. Monitor for signs of severe bruising",
                "6. Seek medical attention if severe pain persists"
            ].join('\n\n'),
            
            'Burn': [
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
            
            'Cut': [
                "1. Stop the Bleeding:",
                "• Apply direct pressure using clean cloth or gauze",
                "• Elevate wound above heart if possible",
                "• Add more cloth if bleeding continues",
                "",
                "2. Clean the Wound:",
                "• Wash with cool or warm water",
                "• Use gentle soap if needed",
                "• Avoid alcohol or hydrogen peroxide",
                "",
                "3. Protect the Wound:",
                "• Apply sterile bandage",
                "• Change bandage daily or when wet",
                "• Monitor for signs of infection"
            ].join('\n\n'),
            
            'GunShot': [
                "Control the Bleeding:",
                "1. Locate the wound(s) - check for entrance and exit wounds",
                "2. Apply direct pressure with clean cloth or gauze",
                "3. Maintain pressure until medical personnel arrive",
                "4. Do not remove embedded objects",
                "5. Do not elevate legs for chest/abdominal gunshot wounds",
                "",
                "Monitor and Treat for Shock:",
                "6. Keep victim calm and encourage steady breathing",
                "7. Maintain body temperature with blankets",
                "8. Do not give anything to eat or drink",
                "9. Watch for signs of shock (pale skin, rapid breathing, confusion)"
            ].join('\n\n'),
            
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
            
            'PunctureWound': [
                "1. Stop the Bleeding:",
                "• Apply direct pressure to stop bleeding",
                "• Use clean cloth or gauze",
                "• Elevate if possible",
                "",
                "2. Clean the Wound:",
                "• Wash thoroughly with soap and water",
                "• Do not remove embedded objects",
                "• Apply antiseptic if available",
                "",
                "3. Protect the Wound:",
                "• Cover with sterile bandage",
                "• Change dressing daily",
                "• Monitor for signs of infection",
                "",
                "Seek Medical Attention:",
                "• If object is deeply embedded",
                "• If signs of infection develop",
                "• If wound is in foot or hand"
            ].join('\n\n'),
            
            'HealthyPerson': 'No injury detected. The area appears to be healthy and normal.'
        };
        
        return guidanceMap[injuryType] || 'An injury has been detected. Please ensure the patient is in a safe environment and seek appropriate medical attention.';
    }
    
    getTreatment(injuryType) {
        const treatmentMap = {
            'Abrasion': 'Wound cleaning, antibiotic ointment, bandaging',
            'Amputation': 'Emergency response, bleeding control, immediate transport',
            'Bleeding': 'Direct pressure, elevation, pressure dressing',
            'Bruise': 'Ice therapy, rest, elevation',
            'Burn': 'Cooling, sterile dressing, pain management',
            'Cut': 'Wound cleaning, antibiotic ointment, bandaging',
            'GunShot': 'Emergency response, bleeding control, immediate transport',
            'Laceration': 'Wound cleaning, pressure dressing, tetanus prophylaxis if needed',
            'PunctureWound': 'Wound cleaning, antibiotic treatment, monitoring',
            'HealthyPerson': 'No treatment required'
        };
        
        return treatmentMap[injuryType] || 'Initial assessment, stabilization';
    }
    
    getFollowUp(injuryType) {
        const followUpMap = {
            'Abrasion': 'Daily dressing changes for 3-5 days',
            'Amputation': 'Immediate emergency medical care required',
            'Bleeding': 'Monitor for 24-48 hours, seek care if persistent',
            'Bruise': 'Monitor for 48-72 hours',
            'Burn': 'Immediate medical evaluation recommended',
            'Cut': 'Daily dressing changes for 3-5 days',
            'GunShot': 'Immediate emergency medical care required',
            'Laceration': '24-48 hours for wound assessment',
            'PunctureWound': '24-48 hours for infection monitoring',
            'HealthyPerson': 'No follow-up required'
        };
        
        return followUpMap[injuryType] || 'Medical evaluation recommended';
    }
}

// Make available globally
window.InjuryClassifier = InjuryClassifier;
