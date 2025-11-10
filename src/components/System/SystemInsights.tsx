import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Analytics,
  BugReport,
  Psychology,
  Speed,
  Security,
  Logout,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  TrendingUp,
  Memory,
  Storage
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`system-tabpanel-${index}`}
      aria-labelledby={`system-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SystemInsights: React.FC = () => {
  const { logout } = useAuth();
  const { assessments, systemMetrics } = useData();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Generate mock system performance data
  const systemPerformance = {
    uptime: '99.9%',
    responseTime: '127ms',
    errorRate: '0.1%',
    throughput: '1.2k req/min',
    memoryUsage: 68,
    cpuUsage: 34,
    diskUsage: 45
  };

  const mlMetrics = {
    accuracy: systemMetrics.accuracy,
    precision: 0.89,
    recall: 0.85,
    f1Score: 0.87,
    falsePositives: 12,
    falseNegatives: 8,
    totalPredictions: assessments.length
  };

  const emotionModelMetrics = {
    accuracy: 0.82,
    confidenceThreshold: 0.7,
    processingTime: '45ms',
    supportedEmotions: ['happy', 'sad', 'angry', 'neutral', 'anxious']
  };

  const systemLogs = [
    { id: 1, timestamp: new Date().toISOString(), level: 'INFO', message: 'ML model prediction completed successfully', component: 'ML_SERVICE' },
    { id: 2, timestamp: new Date(Date.now() - 300000).toISOString(), level: 'WARNING', message: 'High emotion detection confidence threshold exceeded', component: 'EMOTION_SERVICE' },
    { id: 3, timestamp: new Date(Date.now() - 600000).toISOString(), level: 'INFO', message: 'User assessment submitted and processed', component: 'ASSESSMENT_SERVICE' },
    { id: 4, timestamp: new Date(Date.now() - 900000).toISOString(), level: 'ERROR', message: 'Webcam access denied by user', component: 'CAMERA_SERVICE' },
    { id: 5, timestamp: new Date(Date.now() - 1200000).toISOString(), level: 'INFO', message: 'System backup completed successfully', component: 'BACKUP_SERVICE' },
  ];

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'INFO': return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'WARNING': return <Warning sx={{ color: 'warning.main' }} />;
      case 'ERROR': return <ErrorIcon sx={{ color: 'error.main' }} />;
      default: return <CheckCircle sx={{ color: 'success.main' }} />;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'success';
      case 'WARNING': return 'warning';
      case 'ERROR': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box className="dashboard-container">
      <AppBar position="static" sx={{ bgcolor: '#424242' }}>
        <Toolbar>
          <Analytics sx={{ fontSize: 28, mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            System Insights - ML & Performance Analytics
          </Typography>
          <Button
            color="inherit"
            onClick={logout}
            startIcon={<Logout />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>System Diagnostics:</strong> This dashboard provides insights into ML model performance, 
            system health, and emotion recognition accuracy. Data is useful for academic research and 
            system optimization.
          </Typography>
        </Alert>

        {/* System Health Overview */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Speed sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">System Uptime</Typography>
                <Typography variant="h4">{systemPerformance.uptime}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Psychology sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">ML Accuracy</Typography>
                <Typography variant="h4">{(mlMetrics.accuracy * 100).toFixed(1)}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Response Time</Typography>
                <Typography variant="h4">{systemPerformance.responseTime}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Security sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Error Rate</Typography>
                <Typography variant="h4">{systemPerformance.errorRate}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<Psychology />} label="ML Performance" />
            <Tab icon={<Analytics />} label="System Metrics" />
            <Tab icon={<BugReport />} label="System Logs" />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* ML Model Performance */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Mental Health Risk Model
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Accuracy"
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={mlMetrics.accuracy * 100}
                                sx={{ width: 100, height: 6 }}
                              />
                              <Typography variant="body2">
                                {(mlMetrics.accuracy * 100).toFixed(1)}%
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Precision"
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={mlMetrics.precision * 100}
                                sx={{ width: 100, height: 6 }}
                                color="secondary"
                              />
                              <Typography variant="body2">
                                {(mlMetrics.precision * 100).toFixed(1)}%
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Recall"
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={mlMetrics.recall * 100}
                                sx={{ width: 100, height: 6 }}
                                color="success"
                              />
                              <Typography variant="body2">
                                {(mlMetrics.recall * 100).toFixed(1)}%
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="F1 Score"
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={mlMetrics.f1Score * 100}
                                sx={{ width: 100, height: 6 }}
                                color="warning"
                              />
                              <Typography variant="body2">
                                {(mlMetrics.f1Score * 100).toFixed(1)}%
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Emotion Recognition Model */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Emotion Recognition Model
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Accuracy"
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={emotionModelMetrics.accuracy * 100}
                                sx={{ width: 100, height: 6 }}
                              />
                              <Typography variant="body2">
                                {(emotionModelMetrics.accuracy * 100).toFixed(1)}%
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Processing Time"
                          secondary={emotionModelMetrics.processingTime}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Confidence Threshold"
                          secondary={`${emotionModelMetrics.confidenceThreshold * 100}%`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Supported Emotions"
                          secondary={
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                              {emotionModelMetrics.supportedEmotions.map((emotion) => (
                                <Chip
                                  key={emotion}
                                  label={emotion}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          }
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Confusion Matrix */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Model Performance Summary
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4" color="success.main">
                            {mlMetrics.totalPredictions - mlMetrics.falsePositives - mlMetrics.falseNegatives}
                          </Typography>
                          <Typography variant="body2">True Predictions</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4" color="warning.main">
                            {mlMetrics.falsePositives}
                          </Typography>
                          <Typography variant="body2">False Positives</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4" color="error.main">
                            {mlMetrics.falseNegatives}
                          </Typography>
                          <Typography variant="body2">False Negatives</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {/* System Resource Usage */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      System Resources
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <Memory />
                        </ListItemIcon>
                        <ListItemText
                          primary="Memory Usage"
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={systemPerformance.memoryUsage}
                                sx={{ width: 100, height: 6 }}
                                color={systemPerformance.memoryUsage > 80 ? 'error' : 'primary'}
                              />
                              <Typography variant="body2">
                                {systemPerformance.memoryUsage}%
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Speed />
                        </ListItemIcon>
                        <ListItemText
                          primary="CPU Usage"
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={systemPerformance.cpuUsage}
                                sx={{ width: 100, height: 6 }}
                                color="secondary"
                              />
                              <Typography variant="body2">
                                {systemPerformance.cpuUsage}%
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Storage />
                        </ListItemIcon>
                        <ListItemText
                          primary="Disk Usage"
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={systemPerformance.diskUsage}
                                sx={{ width: 100, height: 6 }}
                                color="success"
                              />
                              <Typography variant="body2">
                                {systemPerformance.diskUsage}%
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* API Performance */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      API Performance
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Throughput"
                          secondary={systemPerformance.throughput}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Response Time"
                          secondary={systemPerformance.responseTime}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Error Rate"
                          secondary={systemPerformance.errorRate}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Uptime"
                          secondary={systemPerformance.uptime}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Logs
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Level</TableCell>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Component</TableCell>
                        <TableCell>Message</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {systemLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getLogIcon(log.level)}
                              <Chip
                                label={log.level}
                                color={getLogColor(log.level)}
                                size="small"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {log.component}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {log.message}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default SystemInsights;