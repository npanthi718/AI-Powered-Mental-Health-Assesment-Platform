import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import {
  Mood,
  TrendingUp,
  Psychology,
  CheckCircle,
  Warning,
  Info,
  Timeline,
  Assessment
} from '@mui/icons-material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { AssessmentResult } from '../../data/questionBank';

interface AssessmentResultsProps {
  result: AssessmentResult;
  showComparison?: boolean;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ result, showComparison }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#4caf50';
      case 'moderate': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#2196f3';
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'neutral': return '😐';
      case 'surprised': return '😮';
      case 'fearful': return '😨';
      case 'disgusted': return '🤢';
      default: return '😐';
    }
  };

  // Prepare data for radar chart
  const radarData = result.metrics.map(metric => ({
    subject: metric.category,
    score: metric.score * 100,
    fullMark: 100
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 4 }}>
        Your Mental Health Assessment Results
      </Typography>

      {/* Overall Score and Risk Level */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            background: `linear-gradient(135deg, ${getRiskColor(result.riskLevel)}22 0%, ${getRiskColor(result.riskLevel)}44 100%)`
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Overall Mental Health Score
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Typography variant="h2" sx={{ fontWeight: 800, color: getRiskColor(result.riskLevel) }}>
                  {Math.round(result.overallScore * 100)}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.7 }}>
                  /100
                </Typography>
              </Box>
              <Chip
                label={result.riskLevel.toUpperCase()}
                color={result.riskLevel === 'low' ? 'success' : result.riskLevel === 'moderate' ? 'warning' : 'error'}
                sx={{ mt: 2, fontSize: '1.1rem', fontWeight: 600 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Emotional State Analysis
              </Typography>
              <Typography variant="h2" sx={{ mb: 2 }}>
                {getEmotionEmoji(result.emotionalState.primary)}
              </Typography>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {result.emotionalState.primary.charAt(0).toUpperCase() + result.emotionalState.primary.slice(1)}
              </Typography>
              <Chip
                label={`${(result.emotionalState.confidence * 100).toFixed(1)}% Confidence`}
                color="primary"
                variant="outlined"
              />
              {result.emotionalState.secondary && (
                <Typography variant="body1" sx={{ mt: 2, opacity: 0.7 }}>
                  Secondary emotion: {result.emotionalState.secondary}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Metrics */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment />
              Detailed Analysis
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Your Score"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info />
              Key Findings
            </Typography>
            <List>
              {result.metrics.map((metric, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {metric.score > 0.7 ? (
                      <CheckCircle color="success" />
                    ) : metric.score < 0.4 ? (
                      <Warning color="error" />
                    ) : (
                      <Info color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={metric.category}
                    secondary={metric.interpretation}
                  />
                  <Chip
                    label={`${(metric.score * 100).toFixed(0)}%`}
                    color={metric.score > 0.7 ? 'success' : metric.score < 0.4 ? 'error' : 'warning'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Improvement Comparison */}
      {showComparison && result.improvement && (
        <Paper sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp />
            Progress After Activities
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={[
                    { name: 'Before', score: result.improvement.previousScore * 100 },
                    { name: 'After', score: result.improvement.currentScore * 100 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Improvement Summary
                  </Typography>
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    +{result.improvement.changePercent.toFixed(1)}%
                  </Typography>
                  <Typography variant="body1">
                    Activities completed:
                  </Typography>
                  <List dense>
                    {result.improvement.activities.map((activity, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: 'white' }} />
                        </ListItemIcon>
                        <ListItemText primary={activity} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body1">
          This assessment provides insights into your current mental well-being. Remember that mental health is dynamic and can change over time. Consider regular check-ins and professional support when needed.
        </Typography>
      </Alert>
    </Box>
  );
};

export default AssessmentResults;