import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  Timer,
  CheckCircle,
  SelfImprovement,
  PlayArrow,
  Stop,
  Psychology,
  Refresh,
  Videocam,
  Visibility,
  Insights,
  EmojiEmotions
} from '@mui/icons-material';
import { wellnessActivities } from '../../data/questionBank';

let cachedFaceApi: any = null;
let faceModelsLoaded = false;

const loadFaceModels = async () => {
  if (cachedFaceApi && faceModelsLoaded) {
    return cachedFaceApi;
  }
  const mod = await import('face-api.js');
  cachedFaceApi = mod;
  await mod.nets.tinyFaceDetector.loadFromUri('/models');
  await mod.nets.faceExpressionNet.loadFromUri('/models');
  faceModelsLoaded = true;
  return mod;
};

const getDominantExpression = (expressions: Record<string, number>) => {
  let dominant = { label: 'neutral', value: 0 };
  Object.entries(expressions || {}).forEach(([label, value]) => {
    if (value > dominant.value) {
      dominant = { label, value };
    }
  });
  return dominant;
};

export interface ActivitySessionSummary {
  completed: string[];
  completedNames: string[];
  duration: number;
  improvement: number;
  engagementSummary: {
    averageEngagement: number;
    averageAttention: number;
    dominantEmotion: string;
    insights: string[];
  };
}

interface WellnessActivityProps {
  onComplete: (activityResults: ActivitySessionSummary) => void;
}

const WellnessActivity: React.FC<WellnessActivityProps> = ({ onComplete }) => {
  const [selectedActivity, setSelectedActivity] = useState<typeof wellnessActivities[0] | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [completedActivityNames, setCompletedActivityNames] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [monitoringEnabled, setMonitoringEnabled] = useState(false);
  const [monitoringError, setMonitoringError] = useState<string | null>(null);
  const [facePresent, setFacePresent] = useState(false);
  const [engagementScore, setEngagementScore] = useState(0);
  const [attentionScore, setAttentionScore] = useState(0);
  const [dominantEmotion, setDominantEmotion] = useState('neutral');
  const [liveInsights, setLiveInsights] = useState<string[]>([]);
  const [monitoringReady, setMonitoringReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionLoopRef = useRef<number | null>(null);
  const monitoringActiveRef = useRef(false);
  const statsRef = useRef({ frames: 0, engagementTotal: 0, attentionTotal: 0 });
  const insightsRef = useRef<string[]>([]);
  const absentFramesRef = useRef(0);

  const resetMonitoringStats = () => {
    statsRef.current = { frames: 0, engagementTotal: 0, attentionTotal: 0 };
    insightsRef.current = [];
    absentFramesRef.current = 0;
    setEngagementScore(0);
    setAttentionScore(0);
    setDominantEmotion('neutral');
    setLiveInsights([]);
  };

  const pushInsight = (message: string) => {
    if (!message) return;
    if (insightsRef.current[0] === message) return;
    insightsRef.current = [message, ...insightsRef.current].slice(0, 4);
    setLiveInsights(insightsRef.current);
  };

  const stopMonitoring = () => {
    monitoringActiveRef.current = false;
    setMonitoringEnabled(false);
    setMonitoringReady(false);
    setFacePresent(false);
    if (detectionLoopRef.current !== null) {
      cancelAnimationFrame(detectionLoopRef.current);
      detectionLoopRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const detectFrame = async () => {
    if (!monitoringActiveRef.current || !videoRef.current || !cachedFaceApi) {
      return;
    }
    try {
      const detection = await cachedFaceApi
        .detectSingleFace(videoRef.current, new cachedFaceApi.TinyFaceDetectorOptions({ scoreThreshold: 0.4, inputSize: 256 }))
        .withFaceExpressions();

      if (detection) {
        absentFramesRef.current = 0;
        setFacePresent(true);
        const attention = detection.detection.score;
        const expressions = detection.expressions as Record<string, number>;
        const dominant = getDominantExpression(expressions);
        setDominantEmotion(dominant.label);

        statsRef.current.frames += 1;
        statsRef.current.attentionTotal += attention;

        const positivity = (expressions.happy || 0) + (expressions.surprised || 0) * 0.5 + (expressions.neutral || 0) * 0.25;
        const engagementSample = Math.min(1, attention * 0.6 + positivity * 0.4);
        statsRef.current.engagementTotal += engagementSample;

        setAttentionScore(prev => Number(((prev * 0.7) + attention * 0.3).toFixed(2)));
        const averageEngagement = statsRef.current.engagementTotal / statsRef.current.frames;
        setEngagementScore(Number((averageEngagement * 100).toFixed(1)));

        if (attention < 0.45) {
          pushInsight('Engagement dropped. Try refocusing on the activity.');
        } else if (dominant.label === 'happy' && dominant.value > 0.5) {
          pushInsight('Positive emotion detected. Keep going!');
        } else if (dominant.label === 'sad' && dominant.value > 0.4) {
          pushInsight('Noticing some sadness—focus on calm breathing.');
        }
      } else {
        absentFramesRef.current += 1;
        if (absentFramesRef.current > 30) {
          setFacePresent(false);
        }
        if (absentFramesRef.current % 60 === 0) {
          pushInsight('Camera lost sight of you. Sit within view for accurate tracking.');
        }
      }
    } catch (err) {
      console.error('Live monitoring error:', err);
      pushInsight('We had trouble reading the camera feed. Adjust lighting or retry.');
    }
  };

  const detectionLoop = () => {
    if (!monitoringActiveRef.current) return;
    detectFrame().finally(() => {
      detectionLoopRef.current = requestAnimationFrame(detectionLoop);
    });
  };

  const buildEngagementSummary = () => {
    const frames = statsRef.current.frames || 0;
    return {
      averageEngagement: frames ? Number(((statsRef.current.engagementTotal / frames) * 100).toFixed(1)) : 0,
      averageAttention: frames ? Number(((statsRef.current.attentionTotal / frames) * 100).toFixed(1)) : 0,
      dominantEmotion,
      insights: [...insightsRef.current]
    };
  };

  const startMonitoring = async () => {
    try {
      if (monitoringActiveRef.current) return;
      setMonitoringError(null);
      await loadFaceModels();
      monitoringActiveRef.current = true;
      resetMonitoringStats();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setMonitoringEnabled(true);
      setMonitoringReady(true);
      detectionLoop();
    } catch (error: any) {
      console.error('Unable to start monitoring:', error);
      setMonitoringError(error?.message || 'Camera access failed');
      setMonitoringEnabled(false);
      monitoringActiveRef.current = false;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          const newTime = time - 1;
          setProgress(((selectedActivity?.duration || 120) - newTime) / (selectedActivity?.duration || 120) * 100);
          return newTime;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleActivityComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  const startActivity = (activity: typeof wellnessActivities[0]) => {
    setSelectedActivity(activity);
    setTimeLeft(activity.duration);
    setIsActive(true);
    setShowDialog(true);
    startMonitoring().catch(() => {
      // error handled in state
    });
  };

  const stopActivity = () => {
    setIsActive(false);
    setShowDialog(false);
    setProgress(0);
    stopMonitoring();
  };

  const handleActivityComplete = () => {
    if (!selectedActivity) return;
    
    setIsActive(false);
    setShowDialog(false);
    setProgress(0);
    const updatedCompleted = completedActivities.includes(selectedActivity.id)
      ? completedActivities
      : [...completedActivities, selectedActivity.id];
    const updatedNames = completedActivityNames.includes(selectedActivity.name)
      ? completedActivityNames
      : [...completedActivityNames, selectedActivity.name];
    setCompletedActivities(updatedCompleted);
    setCompletedActivityNames(updatedNames);
    setTotalDuration(prev => prev + (selectedActivity?.duration || 0));
    const sessionSummary: ActivitySessionSummary = {
      completed: updatedCompleted,
      completedNames: updatedNames,
      duration: totalDuration + (selectedActivity?.duration || 0),
      improvement: Math.random() * 0.3 + 0.1,
      engagementSummary: buildEngagementSummary()
    };
    
    stopMonitoring();
    
    if (updatedCompleted.length >= 2) {
      // Complete the whole wellness session after 2 activities
      onComplete(sessionSummary);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <SelfImprovement color="primary" sx={{ fontSize: 32 }} />
        Wellness Activities
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Complete at least two activities to help improve your mental state. Each activity takes 1-2 minutes.
      </Alert>

      <Grid container spacing={3}>
        {wellnessActivities.map(activity => (
          <Grid item xs={12} md={6} key={activity.id}>
            <Card 
              sx={{ 
                height: '100%',
                opacity: completedActivities.includes(activity.id) ? 0.7 : 1,
                transform: completedActivities.includes(activity.id) ? 'none' : 'scale(1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: completedActivities.includes(activity.id) ? 'none' : 'scale(1.02)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    {activity.name}
                  </Typography>
                  <Chip 
                    icon={<Timer />}
                    label={`${activity.duration / 60} min`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <List dense>
                  {activity.benefits.map((benefit, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => startActivity(activity)}
                    disabled={completedActivities.includes(activity.id)}
                    startIcon={completedActivities.includes(activity.id) ? <CheckCircle /> : <PlayArrow />}
                  >
                    {completedActivities.includes(activity.id) ? 'Completed' : 'Start Activity'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={showDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Psychology color="primary" />
            {selectedActivity?.name}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center', my: 3, position: 'relative' }}>
                <CircularProgress 
                  variant="determinate" 
                  value={progress}
                  size={140}
                  thickness={4}
                  sx={{
                    circle: {
                      strokeLinecap: 'round',
                    }
                  }}
                />
                <Box sx={{ 
                  position: 'absolute', 
                  left: '50%', 
                  top: '50%', 
                  transform: 'translate(-50%, -50%)'
                }}>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {Math.max(0, Math.floor(timeLeft / 60))}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Remaining
                  </Typography>
                </Box>
              </Box>

              <List>
                {selectedActivity?.instructions.map((instruction, index) => (
                  <Fade in key={index} timeout={500 * (index + 1)}>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={instruction} />
                    </ListItem>
                  </Fade>
                ))}
              </List>

              <LinearProgress 
                variant="determinate" 
                value={progress}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  mt: 2,
                  bgcolor: 'rgba(0,0,0,0.1)'
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Videocam fontSize="small" />
                Live Engagement Monitor
              </Typography>

              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: '#000',
                  minHeight: 220,
                  border: '2px solid rgba(255,255,255,0.08)'
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: monitoringReady ? 'block' : 'none' }}
                />
                {(!monitoringReady || !monitoringEnabled) && !monitoringError && (
                  <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white', gap: 1, bgcolor: 'rgba(0,0,0,0.6)' }}>
                    <CircularProgress color="inherit" size={36} />
                    <Typography variant="body2">Initializing camera...</Typography>
                  </Box>
                )}
                {monitoringError && (
                  <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: 2, color: 'white', bgcolor: 'rgba(0,0,0,0.7)' }}>
                    <Typography variant="body2">{monitoringError}</Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={<Visibility />}
                  color={facePresent ? 'success' : 'warning'}
                  label={facePresent ? 'Face detected' : 'Need face in frame'}
                />
                <Chip
                  icon={<EmojiEmotions />}
                  variant="outlined"
                  label={`Emotion: ${dominantEmotion}`}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Insights fontSize="small" />
                  Engagement
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(0, Math.min(100, engagementScore))}
                  sx={{ height: 8, borderRadius: 4, mt: 0.5 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {engagementScore.toFixed(1)}% average presence
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Visibility fontSize="small" />
                  Attention
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(0, Math.min(100, attentionScore * 100))}
                  sx={{ height: 8, borderRadius: 4, mt: 0.5 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {(attentionScore * 100).toFixed(0)}% focus consistency
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Real-time insights
              </Typography>
              {liveInsights.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Stay within view and follow the guidance to receive feedback.
                </Typography>
              ) : (
                <List dense>
                  {liveInsights.map((insight, idx) => (
                    <ListItem key={`${insight}-${idx}`}>
                      <ListItemIcon>
                        <Insights color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={insight} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              stopMonitoring();
              startMonitoring().catch(() => undefined);
            }}
            startIcon={<Refresh />}
          >
            Restart Camera
          </Button>
          <Button
            onClick={handleActivityComplete}
            variant="outlined"
            startIcon={<Stop />}
          >
            End Early
          </Button>
          {timeLeft === 0 && (
            <Button
              onClick={handleActivityComplete}
              variant="contained"
              startIcon={<CheckCircle />}
              color="success"
            >
              Complete Activity
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {completedActivities.length > 0 && completedActivities.length < 2 && (
        <Paper sx={{ mt: 3, p: 3, bgcolor: 'primary.light', color: 'white' }}>
          <Typography variant="h6" gutterBottom>
            Progress Update
          </Typography>
          <Typography variant="body1">
            {2 - completedActivities.length} more {2 - completedActivities.length === 1 ? 'activity' : 'activities'} needed for improvement assessment
          </Typography>
          <LinearProgress 
            variant="determinate"
            value={completedActivities.length * 50}
            sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)' }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default WellnessActivity;