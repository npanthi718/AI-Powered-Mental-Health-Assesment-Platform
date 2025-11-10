import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  LinearProgress,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Psychology,
  CameraAlt,
  Stop,
  CheckCircle,
  Warning
} from '@mui/icons-material';

interface EmotionAnalysisProps {
  onComplete: (emotionData: {
    type: string;
    score: number;
    confidence: number;
    secondary?: string;
  }) => void;
  onError: (error: string) => void;
}

const EmotionAnalysis: React.FC<EmotionAnalysisProps> = ({ onComplete, onError }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectionConfidence, setDetectionConfidence] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [calibrationComplete, setCalibrationComplete] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameResultsRef = useRef<Array<{expressions: Record<string, number>, confidence: number}>>([]);
  const detectionLoopRef = useRef<number | null>(null);
  const isDetectingRef = useRef<boolean>(false);
  const analysisStartedRef = useRef<boolean>(false);
  
  let faceapi: any = null;

  const ensureFaceApi = async () => {
    try {
      // Check if already loaded
      if (faceapi && faceapi.nets && faceapi.nets.tinyFaceDetector && faceapi.nets.tinyFaceDetector.isLoaded) {
        console.log('Face API models already loaded');
        return true;
      }
      
      setModelsLoading(true);
      const mod = await import('face-api.js');
      faceapi = mod;
      
      console.log('Loading face detection models from /models...');
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        console.log('✓ TinyFaceDetector loaded');
      } catch (err) {
        console.error('Failed to load TinyFaceDetector:', err);
        throw new Error('Failed to load face detector model. Check console for details.');
      }
      
      try {
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        console.log('✓ FaceExpressionNet loaded');
      } catch (err) {
        console.error('Failed to load FaceExpressionNet:', err);
        throw new Error('Failed to load expression model. Check console for details.');
      }
      
      console.log('✓ Face detection models loaded successfully');
      setModelsLoading(false);
      return true;
    } catch (err: any) {
      console.error('Face API initialization failed:', err);
      setModelsLoading(false);
      const errorMsg = err.message || 'Failed to load face detection models. Please check if model files are available in /public/models directory.';
      setCameraError(errorMsg);
      onError('Failed to initialize emotion detection. Please refresh and try again.');
      return false;
    }
  };

  // Handle video stream assignment when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      const video = videoRef.current;
      console.log('✓ useEffect: Setting stream to video element');
      video.srcObject = stream;
      
      // Try to play
      video.play()
        .then(() => {
          console.log('✓ useEffect: Video play() successful');
          // Wait for video to have dimensions
          const checkVideo = () => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              console.log('✓ useEffect: Video has dimensions:', video.videoWidth, 'x', video.videoHeight);
              setVideoReady(true);
              // Start face detection after a short delay
              setTimeout(async () => {
                await startFaceDetectionLoop();
              }, 300);
            } else {
              // Retry after 100ms
              setTimeout(checkVideo, 100);
            }
          };
          checkVideo();
        })
        .catch((err) => {
          console.warn('useEffect: Video play() error:', err);
        });
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stopFaceDetectionLoop();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startWebcam = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: false
      });
      
      console.log('Camera stream obtained:', mediaStream);
      console.log('Video tracks:', mediaStream.getVideoTracks());

      // Set stream - useEffect will handle video element assignment
      setStream(mediaStream);
      console.log('✓ Stream state set, useEffect will handle video element');
      
    } catch (error: any) {
      console.error('✗ Camera access error:', error);
      setCameraError(error.message || 'Could not access camera');
      onError('Camera access failed. Please check permissions and try again.');
    }
  };

  const stopFaceDetectionLoop = () => {
    isDetectingRef.current = false;
    if (detectionLoopRef.current !== null) {
      cancelAnimationFrame(detectionLoopRef.current);
      detectionLoopRef.current = null;
    }
  };

  const startFaceDetectionLoop = async () => {
    if (!await ensureFaceApi()) {
      console.error('Failed to load face-api models');
      return;
    }
    
    // Stop any existing detection loop
    stopFaceDetectionLoop();
    
    // Verify video is ready
    if (!videoRef.current) {
      console.warn('✗ Video element not available for detection');
      return;
    }
    
    const video = videoRef.current;
    
    // Wait for video to have valid dimensions with retries
    let retries = 0;
    const maxRetries = 20; // Wait up to 4 seconds (20 * 200ms)
    
    while (retries < maxRetries && (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      retries++;
      console.log(`Waiting for video... (${retries}/${maxRetries}) - readyState: ${video.readyState}, dimensions: ${video.videoWidth}x${video.videoHeight}`);
    }
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('✗ Video dimensions are invalid after waiting');
      console.error('  - readyState:', video.readyState);
      console.error('  - videoWidth:', video.videoWidth);
      console.error('  - videoHeight:', video.videoHeight);
      setCameraError('Video stream is not ready. Please check your camera connection.');
      return;
    }
    
    console.log('✓ Video is ready for detection');
    console.log('  - Dimensions:', video.videoWidth, 'x', video.videoHeight);
    console.log('  - ReadyState:', video.readyState);
    
    // Verify video track is active from the stream state
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      if (videoTracks && videoTracks.length > 0) {
        const track = videoTracks[0];
        console.log('  - Active video track:', {
          label: track.label,
          enabled: track.enabled,
          readyState: track.readyState,
          settings: track.getSettings()
        });
      } else {
        console.warn('⚠ No active video tracks found in stream!');
      }
    }
    
    isDetectingRef.current = true;
    let lastDetectionTime = 0;
    const detectionInterval = 150; // Detect every 150ms (~6.7 FPS) to avoid overloading
    
    const detectFace = async () => {
      if (!isDetectingRef.current || !videoRef.current || !faceapi) {
        return;
      }
      
      const currentVideo = videoRef.current;
      const now = Date.now();
      
      // Throttle detection to avoid overloading
      if (now - lastDetectionTime < detectionInterval) {
        detectionLoopRef.current = requestAnimationFrame(detectFace);
        return;
      }
      
      // Check if video is still valid
      if (currentVideo.readyState < 2 || currentVideo.videoWidth === 0 || currentVideo.videoHeight === 0) {
        detectionLoopRef.current = requestAnimationFrame(detectFace);
        return;
      }
      
      lastDetectionTime = now;
      
      try {
        // Check video is still valid
        if (currentVideo.videoWidth === 0 || currentVideo.videoHeight === 0 || currentVideo.readyState < 2) {
          console.warn('Video not ready for detection, skipping frame');
          detectionLoopRef.current = requestAnimationFrame(detectFace);
          return;
        }
        
        // Use optimized detection options - try different sizes for better detection
        const options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 320, // Good size for webcam - not too small, not too large
          scoreThreshold: 0.05 // Very low threshold to catch faces
        });
        
        // Perform detection
        const detection = await faceapi
          .detectSingleFace(currentVideo, options)
          .withFaceExpressions();
          
        if (detection && detection.detection) {
          const confidence = detection.detection.score;
          const box = detection.detection.box;
          
          // Log successful detection occasionally for debugging
          if (confidence > 0.3) {
            console.log(`✓ Face detected! Confidence: ${(confidence * 100).toFixed(1)}%, Box: ${Math.round(box.width)}x${Math.round(box.height)} at (${Math.round(box.x)}, ${Math.round(box.y)})`);
          }
          
          // Update state immediately
          setFaceDetected(true);
          setDetectionConfidence(confidence);
          
          // Collect frames during analysis
          if (analysisStartedRef.current && confidence > 0.3) {
            frameResultsRef.current.push({
              expressions: detection.expressions,
              confidence: confidence
            });
            setFrameCount(prev => prev + 1);
          }
        } else {
          // No detection - update state
          setFaceDetected(false);
          setDetectionConfidence(0);
        }
      } catch (err: any) {
        console.error('✗ Face detection error:', err);
        if (err.message && err.message.includes('model')) {
          console.error('✗ Model loading issue. Please check if models are available at /models');
          setCameraError('Face detection models not loaded. Please refresh the page.');
          stopFaceDetectionLoop();
        } else {
          // Don't stop on other errors, just log them
          console.warn('Detection error (continuing):', err.message || err);
        }
      }
      
      // Continue detection loop
      if (isDetectingRef.current) {
        detectionLoopRef.current = requestAnimationFrame(detectFace);
      }
    };
    
    // Start detection loop with a small delay to ensure video is playing
    setTimeout(() => {
      if (isDetectingRef.current) {
        detectFace();
      }
    }, 200);
  };

  const startAnalysis = async () => {
    if (!faceDetected || detectionConfidence < 0.5) {
      setCameraError('Please position your face clearly in the frame. Make sure you are well-lit and facing the camera directly.');
      return;
    }
    
    analysisStartedRef.current = true;
    setAnalysisStarted(true);
    setIsProcessing(true);
    frameResultsRef.current = [];
    setFrameCount(0);
    setCalibrationComplete(false);
    
    // Calibration period - wait for more frames
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCalibrationComplete(true);
    
    // Main analysis period (5 seconds)
    const analysisDuration = 5000;
    const startTime = Date.now();
    
    // Continue analysis until time is up
    while (Date.now() - startTime < analysisDuration) {
      await new Promise(resolve => setTimeout(resolve, 100));
      // Detection continues in the background via the loop
    }
    
    // Process results
    const results = frameResultsRef.current;
    if (results.length < 5) {
      setCameraError('Not enough valid frames captured. Please ensure your face is clearly visible and try again.');
      setIsProcessing(false);
      analysisStartedRef.current = false;
      setAnalysisStarted(false);
      return;
    }
    
    // Calculate weighted average of emotions
    const emotions: Record<string, number> = {};
    let totalConfidence = 0;
    
    results.forEach(frame => {
      const weight = frame.confidence;
      totalConfidence += weight;
      
      Object.entries(frame.expressions).forEach(([emotion, value]) => {
        emotions[emotion] = (emotions[emotion] || 0) + value * weight;
      });
    });
    
    // Normalize
    Object.keys(emotions).forEach(key => {
      emotions[key] /= totalConfidence;
    });
    
    // Find primary and secondary emotions
    const sortedEmotions = Object.entries(emotions)
      .sort(([,a], [,b]) => b - a);
    
    const [primaryEmotion, secondaryEmotion] = sortedEmotions;
    const avgConfidence = totalConfidence / results.length;
    
    onComplete({
      type: primaryEmotion[0],
      score: primaryEmotion[1],
      confidence: avgConfidence,
      secondary: secondaryEmotion[0]
    });
    
    stopWebcam();
  };

  const stopWebcam = () => {
    // Stop detection loop
    stopFaceDetectionLoop();
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setFaceDetected(false);
    setDetectionConfidence(0);
    analysisStartedRef.current = false;
    setAnalysisStarted(false);
    setFrameCount(0);
    setCalibrationComplete(false);
    setCameraError(null);
    setVideoReady(false);
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Psychology color="primary" sx={{ fontSize: 32 }} />
        AI Emotion Analysis
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Position yourself naturally in front of the camera. The AI will analyze your emotional state to provide more accurate assessment results.
      </Alert>

      <Box sx={{ textAlign: 'center' }}>
        {stream ? (
          <Box>
            <Paper sx={{ 
              p: 2, 
              mb: 3, 
              display: 'inline-block',
              borderRadius: 3,
              background: 'rgba(0, 0, 0, 0.05)',
              border: faceDetected ? '3px solid #4caf50' : '3px solid #ff9800',
              position: 'relative'
            }}>
              <Box sx={{ position: 'relative', display: 'inline-block', width: '100%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ 
                    width: '100%',
                    maxWidth: '640px',
                    height: 'auto',
                    minHeight: '360px',
                    borderRadius: '8px',
                    transform: 'scaleX(-1)',
                    backgroundColor: '#000',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
                
                {!videoReady && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    minHeight: '360px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderRadius: '8px',
                    zIndex: 10
                  }}>
                    <CircularProgress sx={{ color: '#fff', mb: 2 }} />
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      Initializing camera...
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Face detection indicator */}
              <Box sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                zIndex: 10
              }}>
                <Chip
                  icon={faceDetected ? <CheckCircle /> : <Warning />}
                  label={faceDetected ? `Face Detected (${Math.round(detectionConfidence * 100)}%)` : 'No Face Detected'}
                  color={faceDetected ? 'success' : 'warning'}
                  variant="filled"
                />
              </Box>
              
              {/* Models loading indicator */}
              {modelsLoading && (
                <Box sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 10
                }}>
                  <Chip
                    label="Loading Models..."
                    color="info"
                    variant="filled"
                    icon={<CircularProgress size={16} />}
                  />
                </Box>
              )}
              
              {/* Analysis progress */}
              {analysisStarted && (
                <Box sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '90%',
                  textAlign: 'center'
                }}>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                    {calibrationComplete ? 'Analyzing Expressions...' : 'Calibrating...'}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={frameCount * 2}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#4caf50'
                      }
                    }}
                  />
                </Box>
              )}
              
              {isProcessing && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.7)',
                  borderRadius: '8px'
                }}>
                  <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <CircularProgress size={60} sx={{ mb: 2 }} />
                    <Typography variant="h6">
                      Analyzing Emotions...
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      Please maintain a natural expression
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {!analysisStarted && (
                <Button
                  variant="contained"
                  onClick={startAnalysis}
                  disabled={!faceDetected || detectionConfidence < 0.5}
                  startIcon={<Psychology />}
                  size="large"
                  sx={{ 
                    minWidth: 200,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  Start Analysis {faceDetected && `(Confidence: ${Math.round(detectionConfidence * 100)}%)`}
                </Button>
              )}
              
              <Button
                variant="outlined"
                onClick={stopWebcam}
                startIcon={<Stop />}
                size="large"
                color="error"
              >
                Stop Camera
              </Button>
            </Box>
            
            {cameraError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {cameraError}
              </Alert>
            )}
            
            {!faceDetected && videoReady && !modelsLoading && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Face not detected.</strong> Please ensure:
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li>Your face is clearly visible in the camera</li>
                    <li>You are in a well-lit area</li>
                    <li>You are facing the camera directly</li>
                    <li>No objects are blocking your face</li>
                  </ul>
                </Typography>
              </Alert>
            )}
          </Box>
        ) : (
          <Button
            variant="contained"
            onClick={startWebcam}
            startIcon={<CameraAlt />}
            size="large"
            sx={{ mb: 2 }}
          >
            Start Camera
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default EmotionAnalysis;