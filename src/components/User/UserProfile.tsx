import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';
import {
  Person,
  Assessment,
  TrendingUp,
  Psychology,
  CalendarToday
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { getUserAssessments } = useData();

  const userAssessments = getUserAssessments(user?.id || '');
  const sortedAssessments = userAssessments.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

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

  const averageRiskScore = userAssessments.length > 0 
    ? userAssessments.reduce((sum, assessment) => sum + assessment.riskScore, 0) / userAssessments.length
    : 0;

  const riskTrend = userAssessments.length >= 2 
    ? userAssessments[userAssessments.length - 1].riskScore - userAssessments[userAssessments.length - 2].riskScore
    : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 80, 
                  height: 80, 
                  margin: '0 auto 16px',
                  fontSize: '2rem'
                }}
              >
                {user?.name.charAt(0)}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Chip
                label={user?.role === 'admin' ? 'Administrator' : 'User'}
                color={user?.role === 'admin' ? 'secondary' : 'primary'}
                size="small"
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                  Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Assessment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" color="primary">
                    {userAssessments.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Assessments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" color="success">
                    {(averageRiskScore * 100).toFixed(0)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Risk Score
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Psychology sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h4" color="secondary">
                    {riskTrend > 0 ? '+' : ''}{(riskTrend * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recent Trend
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Assessment History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Assessment History
            </Typography>
            
            {sortedAssessments.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Assessment sx={{ fontSize: 48, mb: 2 }} />
                <Typography>No assessments completed yet.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Risk Level</TableCell>
                      <TableCell>Risk Score</TableCell>
                      <TableCell>Emotion</TableCell>
                      <TableCell>Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell>
                          {new Date(assessment.timestamp).toLocaleDateString()}
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
                            <LinearProgress
                              variant="determinate"
                              value={assessment.riskScore * 100}
                              sx={{ width: 60, height: 6 }}
                              color={getRiskColor(assessment.riskLevel)}
                            />
                            <Typography variant="body2">
                              {(assessment.riskScore * 100).toFixed(1)}%
                            </Typography>
                          </Box>
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
                          <Typography variant="body2" color="text.secondary">
                            {assessment.recommendations.length} recommendations
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;