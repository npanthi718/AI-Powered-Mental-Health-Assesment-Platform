import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

interface Assessment {
  id: string;
  userId: string;
  riskLevel: 'low' | 'moderate' | 'high';
  riskScore: number;
  emotionType: string;
  timestamp: string;
}

interface Analytics {
  totalUsers: number;
  totalAssessments: number;
  riskDistribution: Record<string, number>;
  emotionDistribution: Record<string, number>;
}

interface SystemMetrics {
  totalAssessments: number;
  accuracy: number;
  modelVersion: string;
  lastUpdate: string;
}

interface AnalyticsViewProps {
  assessments: Assessment[];
  analytics: Analytics;
  systemMetrics: SystemMetrics;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ assessments, analytics, systemMetrics }) => {
  const COLORS = ['#4caf50', '#ff9800', '#f44336'];
  const EMOTION_COLORS = ['#2196f3', '#ff9800', '#f44336', '#9c27b0', '#4caf50'];

  const riskData = Object.entries(analytics.riskDistribution).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value
  }));

  const emotionData = Object.entries(analytics.emotionDistribution).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value
  }));

  // Create trend data for the last 7 days
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayAssessments = assessments.filter(a => 
      a.timestamp.startsWith(dateStr)
    );
    
    const riskCounts = dayAssessments.reduce((acc, a) => {
      acc[a.riskLevel] = (acc[a.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      low: riskCounts.low || 0,
      moderate: riskCounts.moderate || 0,
      high: riskCounts.high || 0,
      total: dayAssessments.length
    };
  }).reverse();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'moderate': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'anxious': return '😰';
      case 'neutral': return '😐';
      default: return '😐';
    }
  };

  const averageRiskScore = assessments.length > 0 
    ? assessments.reduce((sum, a) => sum + a.riskScore, 0) / assessments.length
    : 0;

  const recentAssessments = assessments
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Risk Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Level Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Emotion Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Emotion Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={emotionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Trend Over Time */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Level Trends (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="low" stroke="#4caf50" name="Low Risk" />
                  <Line type="monotone" dataKey="moderate" stroke="#ff9800" name="Moderate Risk" />
                  <Line type="monotone" dataKey="high" stroke="#f44336" name="High Risk" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* System Performance */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Performance
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Model Accuracy</Typography>
                <LinearProgress
                  variant="determinate"
                  value={systemMetrics.accuracy * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {(systemMetrics.accuracy * 100).toFixed(1)}%
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Average Risk Score</Typography>
                <LinearProgress
                  variant="determinate"
                  value={averageRiskScore * 100}
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {(averageRiskScore * 100).toFixed(1)}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">Model Version</Typography>
                <Typography variant="h6" color="primary">
                  v{systemMetrics.modelVersion}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Assessments */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Assessments
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>User ID</TableCell>
                      <TableCell>Risk Level</TableCell>
                      <TableCell>Emotion</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {assessment.userId.slice(0, 8)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={assessment.riskLevel}
                            color={getRiskColor(assessment.riskLevel)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{getEmotionIcon(assessment.emotionType)}</span>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                              {assessment.emotionType}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {(assessment.riskScore * 100).toFixed(1)}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(assessment.timestamp).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsView;