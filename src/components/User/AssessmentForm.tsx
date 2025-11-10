import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Alert,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade
} from '@mui/material';
import { Psychology, CheckCircle, Lightbulb } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import EmotionAnalysis from './EmotionAnalysis';
import WellnessActivity from './WellnessActivity';
import AssessmentResults from './AssessmentResults';
import { mentalHealthQuestions as fullQuestionBank, wellnessActivities, AssessmentResult } from '../../data/questionBank';

const scaleOptions = [
  { value: 1, label: 'Never/Very Poor', icon: '😞' },
  { value: 2, label: 'Rarely/Poor', icon: '😕' },
  { value: 3, label: 'Sometimes/Fair', icon: '😐' },
  { value: 4, label: 'Often/Good', icon: '🙂' },
  { value: 5, label: 'Always/Excellent', icon: '😊' }
];

function pickRandom<T>(arr: T[], n: number) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

const AssessmentForm: React.FC = () => {
  const { user } = useAuth();
  const { submitAssessment } = useData();

  // Flow phases: emotion -> questions -> results -> activities -> postQuestions -> postResults
  const [phase, setPhase] = useState<'emotion' | 'questions' | 'results' | 'activities' | 'postQuestions' | 'postResults'>('emotion');
  const [emotionData, setEmotionData] = useState<any>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [postResult, setPostResult] = useState<AssessmentResult | null>(null);
  const [activitySession, setActivitySession] = useState<any | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize selected questions when emotion completed or when starting new question phase
    if (phase === 'questions') {
      const picks = pickRandom(fullQuestionBank, 10);
      setSelectedQuestions(picks);
      setCurrentIndex(0);
      setResponses({});
    }
    if (phase === 'postQuestions') {
      const picks = pickRandom(fullQuestionBank, 10);
      setSelectedQuestions(picks);
      setCurrentIndex(0);
      setResponses({});
    }
  }, [phase]);

  const onEmotionComplete = (data: any) => {
    setEmotionData(data);
    setPhase('questions');
  };

  const onEmotionError = (err: string) => {
    setCameraError(err);
  };

  const answerCurrent = (questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    // Auto-advance after a short delay for UX
    setTimeout(() => {
      if (currentIndex < selectedQuestions.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        // finalize
        computeResult();
      }
    }, 350);
  };

  const computeResult = (isPost = false) => {
    // derive per-category metrics
    const buckets: Record<string, number[]> = {};
    selectedQuestions.forEach(q => {
      const v = responses[q.id] || 0;
      if (!buckets[q.category]) buckets[q.category] = [];
      buckets[q.category].push(v);
    });

    const metrics = Object.entries(buckets).map(([category, vals]) => {
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length; // 1-5
      const normalized = (avg - 1) / 4; // 0-1
      const interpretation = normalized > 0.7 ? 'Strong' : normalized > 0.4 ? 'Moderate' : 'Needs Attention';
      const recommendations = normalized > 0.7 ? ['Maintain habits'] : normalized > 0.4 ? ['Try targeted activities'] : ['Consider professional help'];
      return { category, score: normalized, interpretation, recommendations };
    });

    const overallScore = metrics.reduce((a, b) => a + b.score, 0) / (metrics.length || 1);

    // emotion modifier
    let emotionModifier = 0.85;
    if (emotionData) {
      switch (emotionData.type) {
        case 'happy': emotionModifier = 1.0; break;
        case 'neutral': emotionModifier = 0.95; break;
        case 'sad': emotionModifier = 0.7; break;
        case 'anxious': emotionModifier = 0.72; break;
        case 'angry': emotionModifier = 0.7; break;
      }
    }

    const combined = overallScore * 0.8 + emotionModifier * 0.2; // weights
    const riskScore = 1 - combined;
    const riskLevel = riskScore < 0.35 ? 'low' : riskScore < 0.65 ? 'moderate' : 'high';

    const res: AssessmentResult = {
      overallScore: Math.max(0, Math.min(1, combined)),
      riskLevel: riskLevel as any,
      emotionalState: {
        primary: emotionData?.type || 'neutral',
        confidence: emotionData?.confidence || emotionData?.score || 0,
        secondary: emotionData?.secondary
      },
      metrics,
      timestamp: new Date().toISOString()
    };

    if (!isPost) {
      setResult(res);
      setPhase('results');
      // submit
      submitAssessment({
        userId: user?.id || '',
        responses,
        emotionScore: emotionData?.score || 0,
        emotionType: emotionData?.type || 'neutral',
        riskLevel: res.riskLevel,
        riskScore,
        recommendations: metrics.flatMap(m => m.recommendations)
      });
    } else {
      setPostResult(res);
      setPhase('postResults');
      // submit post-activity assessment too
      submitAssessment({
        userId: user?.id || '',
        responses,
        emotionScore: emotionData?.score || 0,
        emotionType: emotionData?.type || 'neutral',
        riskLevel: res.riskLevel,
        riskScore,
        recommendations: metrics.flatMap(m => m.recommendations)
      });
    }
  };

  const startActivities = () => {
    setPhase('activities');
  };

  const onActivitiesComplete = (session: any) => {
    // session contains completed activities and improvement estimate
    setActivitySession(session);
    // after activities, start postQuestions flow
    setPhase('postQuestions');
  };

  const resetAll = () => {
    setPhase('emotion');
    setEmotionData(null);
    setSelectedQuestions([]);
    setCurrentIndex(0);
    setResponses({});
    setResult(null);
    setPostResult(null);
    setActivitySession(null);
    setCameraError(null);
  };

  
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 700 }}>
        AI-Powered Mental Health Assessment
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Confidential Assessment:</strong> This assessment helps us understand your current mental health status. Your responses are processed locally.
        </Typography>
      </Alert>

      {phase === 'emotion' && (
        <EmotionAnalysis onComplete={onEmotionComplete} onError={onEmotionError} />
      )}

      {(phase === 'questions' || phase === 'postQuestions') && selectedQuestions.length > 0 && (
        <Fade in timeout={300}>
          <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Chip label={`Question ${currentIndex + 1} / ${selectedQuestions.length}`} color="primary" sx={{ mr: 2, fontWeight: 600 }} />
              <Chip label={selectedQuestions[currentIndex].category} variant="outlined" sx={{ textTransform: 'capitalize' }} />
            </Box>

            <Typography variant="h6" sx={{ mb: 3 }}>{selectedQuestions[currentIndex].question}</Typography>

            <Grid container spacing={2}>
              {scaleOptions.map(opt => (
                <Grid item xs={12} sm={6} md={4} key={opt.value}>
                  <Paper sx={{ p: 2, cursor: 'pointer', border: responses[selectedQuestions[currentIndex].id] === opt.value ? '2px solid #1976d2' : '1px solid #e0e0e0', bgcolor: responses[selectedQuestions[currentIndex].id] === opt.value ? '#f3f8ff' : 'white' }}
                    onClick={() => answerCurrent(selectedQuestions[currentIndex].id, opt.value)}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{opt.icon} {opt.value} - {opt.label.split('/')[0]}</Typography>
                    <Typography variant="body2" color="text.secondary">{opt.label.split('/')[1]}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Answers will auto-advance after selection</Typography>
            </Box>
          </Paper>
        </Fade>
      )}

      {phase === 'results' && result && (
        <Box>
          <AssessmentResults result={result} showComparison={false} />
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" onClick={startActivities} startIcon={<Psychology />}>
              Try Wellness Activities
            </Button>
            <Button variant="outlined" onClick={resetAll}>Retake From Start</Button>
          </Box>
        </Box>
      )}

      {phase === 'activities' && (
        <Box>
          <WellnessActivity onComplete={onActivitiesComplete} />
        </Box>
      )}

      {phase === 'postQuestions' && selectedQuestions.length > 0 && (
        <Fade in timeout={300}>
          <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Post-Activity Re-Assessment</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Answer these 10 quick questions to measure improvement</Typography>

            <Typography variant="h6" sx={{ mb: 3 }}>{selectedQuestions[currentIndex].question}</Typography>
            <Grid container spacing={2}>
              {scaleOptions.map(opt => (
                <Grid item xs={12} sm={6} md={4} key={opt.value}>
                  <Paper sx={{ p: 2, cursor: 'pointer', border: responses[selectedQuestions[currentIndex].id] === opt.value ? '2px solid #1976d2' : '1px solid #e0e0e0', bgcolor: responses[selectedQuestions[currentIndex].id] === opt.value ? '#f3f8ff' : 'white' }}
                    onClick={() => answerCurrent(selectedQuestions[currentIndex].id, opt.value)}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{opt.icon} {opt.value} - {opt.label.split('/')[0]}</Typography>
                    <Typography variant="body2" color="text.secondary">{opt.label.split('/')[1]}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Fade>
      )}

      {phase === 'postResults' && postResult && (
        <Box>
          <AssessmentResults result={postResult} showComparison={true} />
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={resetAll}>Done</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AssessmentForm;