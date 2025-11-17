import React, { useState, useEffect } from 'react';
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
  Avatar,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Drawer,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Dashboard,
  People,
  Assessment,
  Chat,
  Analytics,
  Settings,
  Logout,
  Visibility,
  Block,
  Delete,
  Reply,
  Download,
  Refresh,
  Warning,
  TrendingUp,
  Psychology,
  Security,
  NotificationsActive,
  Send,
  Star,
  AdminPanelSettings,
  SupervisorAccount,
  MonitorHeart,
} from '@mui/icons-material';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    assessments, 
    chatMessages, 
    systemMetrics, 
    systemSettings,
    getAllUsers, 
    updateUserStatus, 
    deleteUser,
    getAnalytics,
    getRealTimeActivity,
    getReviews,
    submitChatMessage,
    markChatMessageHandled,
    updateSystemMetrics,
    updateReview,
    deleteReview,
    updateSystemSettings,
    refreshData,
    deleteAssessmentsByIds
  } = useData();

  const [selectedSection, setSelectedSection] = useState('overview');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
  const [assessmentRiskFilter, setAssessmentRiskFilter] = useState<'all' | 'low' | 'moderate' | 'high'>('all');
  const [assessmentRange, setAssessmentRange] = useState<'7' | '30' | '90' | 'all'>('30');
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [selectedAssessmentRecord, setSelectedAssessmentRecord] = useState<any | null>(null);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'featured' | 'flagged'>('all');
  const [systemSettingsDraft, setSystemSettingsDraft] = useState(systemSettings);
  const [liveActionsLog, setLiveActionsLog] = useState<string[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [latencyTrend, setLatencyTrend] = useState(() => {
    return Array.from({ length: 6 }).map((_, idx) => ({
      label: new Date(Date.now() - (5 - idx) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latency: systemMetrics.responseTime,
      uptime: systemMetrics.uptime
    }));
  });

  // Real-time updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateSystemMetrics();
      
      // Check for high-risk assessments
      const highRiskAssessments = assessments.filter(a => 
        a.riskLevel === 'high' && 
        new Date(a.timestamp) > new Date(Date.now() - 300000) // Last 5 minutes
      );
      
      if (highRiskAssessments.length > 0) {
        setSystemAlerts(prev => [
          ...prev.filter(n => n.type !== 'high-risk'),
          {
            id: Date.now(),
            type: 'high-risk',
            message: `🚨 CRITICAL: ${highRiskAssessments.length} high-risk assessment(s) detected!`,
            timestamp: new Date().toISOString(),
            severity: 'error',
            count: highRiskAssessments.length
          }
        ]);
      }

      // Check for new chat messages
      const recentChats = chatMessages.filter(m => 
        !m.response && 
        new Date(m.timestamp) > new Date(Date.now() - 300000)
      );
      
      if (recentChats.length > 0) {
        setSystemAlerts(prev => [
          ...prev.filter(n => n.type !== 'new-chat'),
          {
            id: Date.now() + 1,
            type: 'new-chat',
            message: `💬 ${recentChats.length} new support message(s) require response`,
            timestamp: new Date().toISOString(),
            severity: 'warning',
            count: recentChats.length
          }
        ]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [assessments, chatMessages, updateSystemMetrics]);

  useEffect(() => {
    setSystemSettingsDraft(systemSettings);
  }, [systemSettings]);

  useEffect(() => {
    setLatencyTrend(prev => {
      const nextPoint = {
        label: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latency: systemMetrics.responseTime,
        uptime: systemMetrics.uptime
      };
      const updated = [...prev, nextPoint];
      return updated.slice(-8);
    });
  }, [systemMetrics.responseTime, systemMetrics.uptime]);

  const handleUserAction = (userId: string, action: string) => {
    switch (action) {
      case 'block':
        updateUserStatus(userId, 'blocked');
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'user-action',
          message: `User ${userId.slice(0, 8)} has been blocked`,
          timestamp: new Date().toISOString(),
          severity: 'info'
        }]);
        break;
      case 'activate':
        updateUserStatus(userId, 'active');
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'user-action',
          message: `User ${userId.slice(0, 8)} has been activated`,
          timestamp: new Date().toISOString(),
          severity: 'success'
        }]);
        break;
      case 'delete':
        deleteUser(userId);
        const safeUserId = typeof userId === 'string' ? userId : '';
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'user-action',
          message: `User ${safeUserId.slice(0, 8)} has been deleted`,
          timestamp: new Date().toISOString(),
          severity: 'error'
        }]);
        break;
    }
  };

  const handleChatReply = () => {
    if (selectedChat && replyMessage.trim()) {
      submitChatMessage({
        userId: selectedChat.userId,
        message: `Admin Response: ${replyMessage}`,
        anonymous: false,
        response: 'admin',
        sender: 'support'
      });
      markChatMessageHandled(selectedChat.id, 'admin');
      setReplyMessage('');
      setChatDialogOpen(false);
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'chat-reply',
        message: `Replied to user ${selectedChat.userId.slice(0, 8)}`,
        timestamp: new Date().toISOString(),
        severity: 'success'
      }]);
    }
  };

  const handleAssessmentExport = () => {
    if (filteredAssessments.length === 0) {
      alert('No assessments to export for the current filters.');
      return;
    }
    const header = 'User ID,Risk Level,Risk Score,Emotion,Timestamp\n';
    const rows = filteredAssessments.map((assessment) => {
      const emotion = assessment.emotionType || 'n/a';
      return `${assessment.userId},${assessment.riskLevel},${(assessment.riskScore * 100).toFixed(1)}%,${emotion},${new Date(assessment.timestamp).toLocaleString()}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assessment-report-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openAssessmentDetails = (assessment: any) => {
    setSelectedAssessmentRecord(assessment);
    setAssessmentDialogOpen(true);
  };

  const handleReviewToggleFeatured = (review: any) => {
    updateReview(review.id, { featured: !review.featured });
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'review-action',
      message: `${review.userName} review ${review.featured ? 'removed from' : 'added to'} featured`,
      timestamp: new Date().toISOString(),
      severity: review.featured ? 'warning' : 'success'
    }]);
  };

  const handleReviewDelete = (review: any) => {
    deleteReview(review.id);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'review-action',
      message: `Review from ${review.userName} deleted`,
      timestamp: new Date().toISOString(),
      severity: 'error'
    }]);
  };

  const handleAssessmentDelete = () => {
    if (!selectedAssessmentRecord?.id) return;
    const safeId = typeof selectedAssessmentRecord.id === 'string' ? selectedAssessmentRecord.id : String(selectedAssessmentRecord.id);
    deleteAssessmentsByIds([selectedAssessmentRecord.id]);
    setAssessmentDialogOpen(false);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'assessment-action',
      message: `Assessment ${safeId.slice(0, 8)} removed`,
      timestamp: new Date().toISOString(),
      severity: 'warning'
    }]);
  };

  const saveSystemSettings = () => {
    updateSystemSettings(systemSettingsDraft);
    pushSystemNotification('System thresholds updated successfully', 'success');
  };

  const logLiveAction = (message: string) => {
    setLiveActionsLog(prev => [message, ...prev].slice(0, 6));
  };

  const pushSystemNotification = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setNotifications(prev => [
      {
        id: Date.now(),
        type: 'system',
        message,
        timestamp: new Date().toISOString(),
        severity
      },
      ...prev
    ]);
  };

  const analytics = getAnalytics();
  const users = getAllUsers();
  const activity = getRealTimeActivity();
  const allReviews = getReviews();
  const pendingChats = chatMessages.filter(m => !m.response);

  // Filter users based on search and risk level
  const filteredUsers = users.filter(user => {
    const name = typeof user.name === 'string' ? user.name : '';
    const email = typeof user.email === 'string' ? user.email : '';
    const id = typeof user.id === 'string' ? user.id : '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         id.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterRisk === 'all') return matchesSearch;
    const userAssessments = assessments.filter(a => a.userId === user.id);
    const latestAssessment = userAssessments[userAssessments.length - 1];
    return matchesSearch && latestAssessment?.riskLevel === filterRisk;
  });

  // Chart data
  const riskTrendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayAssessments = assessments.filter(a => 
      a.timestamp.startsWith(date.toISOString().split('T')[0])
    );
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      low: dayAssessments.filter(a => a.riskLevel === 'low').length,
      moderate: dayAssessments.filter(a => a.riskLevel === 'moderate').length,
      high: dayAssessments.filter(a => a.riskLevel === 'high').length,
      total: dayAssessments.length
    };
  }).reverse();

  const emotionData = Object.entries(analytics.emotionDistribution).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: key === 'happy' ? '#4caf50' : 
           key === 'sad' ? '#2196f3' : 
           key === 'angry' ? '#f44336' : 
           key === 'anxious' ? '#ff9800' : '#9c27b0'
  }));

  const riskData = Object.entries(analytics.riskDistribution).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: key === 'low' ? '#4caf50' : key === 'moderate' ? '#ff9800' : '#f44336'
  }));

  const filteredAssessments = React.useMemo(() => {
    return assessments
      .filter((assessment) => {
        const matchesRisk = assessmentRiskFilter === 'all' || assessment.riskLevel === assessmentRiskFilter;
        const matchesSearch = !assessmentSearch.trim() || (assessment.userId?.toLowerCase().includes(assessmentSearch.toLowerCase()));
        if (!matchesRisk || !matchesSearch) return false;
        if (assessmentRange === 'all') return true;
        const days = Number(assessmentRange);
        if (Number.isNaN(days)) return true;
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        return new Date(assessment.timestamp).getTime() >= cutoff;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [assessments, assessmentRiskFilter, assessmentRange, assessmentSearch]);

  const assessmentSummary = React.useMemo(() => {
    if (filteredAssessments.length === 0) {
      return { averageScore: 0, highRiskShare: 0, moderateRiskShare: 0 };
    }
    const avgScore = filteredAssessments.reduce((sum, a) => sum + (1 - a.riskScore), 0) / filteredAssessments.length;
    const highRiskCount = filteredAssessments.filter(a => a.riskLevel === 'high').length;
    const moderateRiskCount = filteredAssessments.filter(a => a.riskLevel === 'moderate').length;
    return {
      averageScore: avgScore,
      highRiskShare: (highRiskCount / filteredAssessments.length) * 100,
      moderateRiskShare: (moderateRiskCount / filteredAssessments.length) * 100
    };
  }, [filteredAssessments]);

  const filteredReviews = React.useMemo(() => {
    return allReviews
      .filter((review) => {
        const matchesSearch = !reviewSearch.trim() ||
          review.userName?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
          review.comment?.toLowerCase().includes(reviewSearch.toLowerCase());
        if (!matchesSearch) return false;
        if (reviewFilter === 'featured') {
          return review.featured;
        }
        if (reviewFilter === 'flagged') {
          return review.flagged;
        }
        return true;
      })
      .slice(0, 25);
  }, [allReviews, reviewFilter, reviewSearch]);

  // Admin sidebar menu items
  const menuItems = [
    { id: 'overview', label: 'System Overview', icon: <Dashboard />, color: '#667eea' },
    { id: 'users', label: 'User Management', icon: <People />, color: '#f093fb' },
    { id: 'assessments', label: 'Assessment Reports', icon: <Assessment />, color: '#4facfe' },
    { id: 'chats', label: 'Chat Management', icon: <Chat />, color: '#fa709a' },
    { id: 'analytics', label: 'Advanced Analytics', icon: <Analytics />, color: '#43e97b' },
    { id: 'reviews', label: 'Review Management', icon: <Star />, color: '#f6d365' },
    { id: 'system', label: 'System Control', icon: <Settings />, color: '#667eea' },
    { id: 'monitoring', label: 'Live Monitoring', icon: <MonitorHeart />, color: '#f093fb' },
  ];

  const getUserDisplayLabel = (userId: string | number) => {
    const safeId = typeof userId === 'string' ? userId : String(userId);
    const shortId = safeId.length > 10 ? `${safeId.slice(0, 10)}…` : safeId;
    const userRecord = users.find(u => u.id === safeId);
    if (userRecord && typeof userRecord.name === 'string' && userRecord.name.length > 0) {
      return `${userRecord.name} (${shortId})`;
    }
    return safeId;
  };

  const formatActivityMessage = (item: any) => {
    const label = getUserDisplayLabel(item.userId);
    if (item.type === 'assessment') {
      return `${label} completed mental health assessment`;
    }
    return `${label} sent support message`;
  };

  const combinedNotifications = [...systemAlerts, ...notifications].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleUserExport = () => {
    if (filteredUsers.length === 0) {
      alert('No users to export for the current filters.');
      return;
    }
    const header = 'Name,Email,Status,Assessments,Last Activity\n';
    const rows = filteredUsers.map((user) => {
      const safeName = typeof user.name === 'string' ? user.name : 'Unknown';
      const safeEmail = typeof user.email === 'string' ? user.email : 'n/a';
      const userAssessments = assessments.filter(a => a.userId === user.id);
      const last = userAssessments[0]?.timestamp ? new Date(userAssessments[0].timestamp).toLocaleString() : 'Never';
      return `"${safeName}","${safeEmail}",${user.status || 'active'},${userAssessments.length},${last}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-report-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderSystemOverview = () => (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: '#1a1a1a', mb: 4 }}>
        🎛️ SYSTEM CONTROL CENTER
      </Typography>
      
      {/* Critical System Alerts */}
      {systemAlerts.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {systemAlerts.slice(0, 3).map((alert) => (
            <Grid item xs={12} key={alert.id}>
              <Alert 
                severity={alert.severity} 
                sx={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 700, 
                  p: 3,
                  border: '3px solid',
                  borderColor: alert.severity === 'error' ? '#f44336' : '#ff9800'
                }}
              >
                {alert.message}
              </Alert>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Real-time System Stats */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white', 
            height: 200,
            transform: 'scale(1)',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.05)' }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <People sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                {analytics.totalUsers}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Total Users</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                Active System Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
            color: 'white', 
            height: 200,
            transform: 'scale(1)',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.05)' }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Assessment sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                {analytics.totalAssessments}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Assessments</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                Total Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
            color: 'white', 
            height: 200,
            transform: 'scale(1)',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.05)' }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Chat sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                {pendingChats.length}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Pending Chats</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                Require Response
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
            color: 'white', 
            height: 200,
            transform: 'scale(1)',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.05)' }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Warning sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                {analytics.highRiskUsers}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>High Risk</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                Critical Attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Live Activity and System Health */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            boxShadow: 4, 
            minHeight: { xs: 400, sm: 520 },
            borderRadius: 3
          }}>
            <CardContent sx={{ maxHeight: { xs: 500, sm: 700 }, overflow: 'auto', p: { xs: 2, sm: 3 } }}>
              <Typography variant="h4" gutterBottom sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                alignItems: 'center', 
                gap: 2, 
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
              }}>
                🔴 LIVE SYSTEM ACTIVITY
                <Chip 
                  label="LIVE" 
                  color="error" 
                  size="small"
                  sx={{ 
                    animation: 'pulse 2s infinite', 
                    fontWeight: 700,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }} 
                />
              </Typography>
              <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                <List>
                  {activity.slice(0, 15).map((item, index) => {
                    return (
                      <ListItem key={index} sx={{ 
                        border: '2px solid #e0e0e0', 
                        mb: 2, 
                        borderRadius: 3,
                        bgcolor: item.riskLevel === 'high' ? '#ffebee' : 'white',
                        boxShadow: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 1, sm: 0 }
                      }}>
                        <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: 56 } }}>
                          {item.type === 'assessment' ? 
                            <Assessment color={item.riskLevel === 'high' ? 'error' : 'primary'} sx={{ fontSize: { xs: 24, sm: 30 } }} /> :
                            <Chat color="secondary" sx={{ fontSize: { xs: 24, sm: 30 } }} />
                          }
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ 
                              fontWeight: 600,
                              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                            }}>
                              {item.message}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body1" color="text.secondary" sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}>
                              {new Date(item.timestamp).toLocaleString()}
                            </Typography>
                          }
                        />
                        {item.riskLevel === 'high' && (
                          <Chip 
                            label="🚨 HIGH RISK" 
                            color="error" 
                            size="small"
                            sx={{ 
                              fontWeight: 700,
                              fontSize: { xs: '0.7rem', sm: '0.875rem' },
                              mt: { xs: 1, sm: 0 }
                            }} 
                          />
                        )}
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            boxShadow: 4, 
            minHeight: { xs: 400, sm: 520 },
            borderRadius: 3
          }}>
            <CardContent sx={{ maxHeight: { xs: 500, sm: 700 }, overflow: 'auto', p: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
              }}>
                📊 Risk Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                🖥️ System Health
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>AI Model Accuracy</Typography>
                <LinearProgress
                  variant="determinate"
                  value={systemMetrics.accuracy * 100}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {(systemMetrics.accuracy * 100).toFixed(1)}%
                </Typography>
              </Box>

              {/* Face Model Manager - check presence of face-api models */}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Face Model Manager</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Verify if browser face-expression model weights are available under <code>/models</code> and enable client-side emotion detection.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={async () => {
                      // simple check: try to fetch a known model file
                      try {
                        const res = await fetch('/models/face_expression_model-weights_manifest.json', { cache: 'no-store' });
                        if (res.ok) {
                          alert('Face model files found at /models. Client detection should be available.');
                        } else {
                          alert('Face model files not found at /models. Please place model files in /public/models. See console for details.');
                          console.warn('Model check status', res.status, res.statusText);
                        }
                      } catch (err) {
                        console.error('Model check failed', err);
                        alert('Failed to check models (network error). See console for details.');
                      }
                    }}
                  >
                    Verify Models
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() => {
                      updateSystemMetrics();
                      alert('System metrics refreshed');
                    }}
                  >
                    Refresh Metrics
                  </Button>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>System Uptime</Typography>
                <LinearProgress
                  variant="determinate"
                  value={systemMetrics.uptime}
                  color="success"
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {systemMetrics.uptime.toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderUserManagement = () => (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
        👥 COMPLETE USER MANAGEMENT SYSTEM
      </Typography>
      
      {/* Search and Filter Controls */}
      <Paper sx={{ p: 4, mb: 4, boxShadow: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="🔍 Search Users"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or ID..."
              size="large"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="large">
              <InputLabel>Filter by Risk Level</InputLabel>
              <Select
                value={filterRisk}
                label="Filter by Risk Level"
                onChange={(e) => setFilterRisk(e.target.value)}
              >
                <MenuItem value="all">All Risk Levels</MenuItem>
                <MenuItem value="low">Low Risk</MenuItem>
                <MenuItem value="moderate">Moderate Risk</MenuItem>
                <MenuItem value="high">High Risk</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Download />}
              size="large"
              sx={{ py: 2, fontSize: '1.1rem', fontWeight: 600 }}
              onClick={handleUserExport}
            >
              Export User Data
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              size="large"
              sx={{ py: 2 }}
              onClick={() => refreshData()}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* User Management Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 4 }}>
        <Table size="large">
          <TableHead>
            <TableRow sx={{ bgcolor: '#1a1a1a' }}>
              <TableCell sx={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', py: 3 }}>User Profile</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>Assessments</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>Risk Level</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>Last Activity</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>Admin Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => {
              const userAssessments = assessments.filter(a => a.userId === user.id);
              const latestAssessment = userAssessments[userAssessments.length - 1];
              const safeId = typeof user.id === 'string' ? user.id : '';
              return (
                <TableRow key={safeId} sx={{ '&:hover': { bgcolor: '#f5f5f5' }, height: 80 }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, fontSize: '1.5rem' }}>
                        {typeof user.name === 'string' && user.name.length > 0 ? user.name.charAt(0) : 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                          {typeof user.name === 'string' && user.name.length > 0 ? user.name : 'Unknown User'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                          {typeof user.email === 'string' ? user.email : ''}
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                          ID: {safeId.slice(0, 12)}...
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status || 'active'}
                      color={user.status === 'blocked' ? 'error' : 'success'}
                      size="large"
                      sx={{ fontWeight: 700, fontSize: '1rem', px: 2 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                      {userAssessments.length}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {latestAssessment ? (
                      <Chip
                        label={latestAssessment.riskLevel.toUpperCase()}
                        color={
                          latestAssessment.riskLevel === 'low' ? 'success' :
                          latestAssessment.riskLevel === 'moderate' ? 'warning' : 'error'
                        }
                        size="large"
                        sx={{ fontWeight: 700, fontSize: '1rem' }}
                      />
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        No assessments
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {latestAssessment ? 
                        new Date(latestAssessment.timestamp).toLocaleDateString() :
                        'Never'
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedUser(user);
                          setUserDialogOpen(true);
                        }}
                        sx={{ bgcolor: 'primary.light', width: 50, height: 50 }}
                      >
                        <Visibility sx={{ fontSize: 24 }} />
                      </IconButton>
                      <IconButton
                        color={user.status === 'blocked' ? 'success' : 'warning'}
                        onClick={() => handleUserAction(user.id, user.status === 'blocked' ? 'activate' : 'block')}
                        sx={{ 
                          bgcolor: user.status === 'blocked' ? 'success.light' : 'warning.light',
                          width: 50, 
                          height: 50 
                        }}
                      >
                        <Block sx={{ fontSize: 24 }} />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleUserAction(user.id, 'delete')}
                        sx={{ bgcolor: 'error.light', width: 50, height: 50 }}
                      >
                        <Delete sx={{ fontSize: 24 }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderChatManagement = () => (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
        💬 LIVE CHAT MANAGEMENT SYSTEM
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 700 }}>
                📨 Pending Support Messages ({pendingChats.length})
                <Chip label="REQUIRES RESPONSE" color="error" size="large" sx={{ fontWeight: 700 }} />
              </Typography>
              <List sx={{ maxHeight: 700, overflow: 'auto' }}>
                {pendingChats.map((chat) => (
                  <ListItem key={chat.id} sx={{ 
                    border: '3px solid #e0e0e0', 
                    mb: 3, 
                    borderRadius: 4,
                    bgcolor: '#f8f9fa',
                    '&:hover': { bgcolor: '#e3f2fd' },
                    p: 3
                  }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {chat.anonymous ? '🔒 Anonymous User' : `👤 User ${chat.userId.slice(0, 8)}`}
                          </Typography>
                          <Typography variant="h6" color="text.secondary">
                            ⏰ {new Date(chat.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 2 }}>
                          <Paper sx={{ p: 3, mb: 3, bgcolor: 'white', border: '2px solid #ddd' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.6 }}>
                              "{chat.message}"
                            </Typography>
                          </Paper>
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={<Reply />}
                            onClick={() => {
                              setSelectedChat(chat);
                              setChatDialogOpen(true);
                            }}
                            sx={{ fontWeight: 700, py: 2, px: 4, fontSize: '1.1rem' }}
                          >
                            📝 Reply to User
                          </Button>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                📋 Quick Response Templates
              </Typography>
              <List>
                {[
                  "Thank you for reaching out. A counselor will respond within 24 hours.",
                  "Your wellbeing is important to us. Please contact emergency services if this is urgent.",
                  "We're here to support you. Let's schedule a follow-up conversation.",
                  "Thank you for sharing. Here are some immediate resources that might help.",
                  "I understand you're going through a difficult time. You're not alone.",
                  "Your message is important to us. We'll provide personalized guidance shortly."
                ].map((template, index) => (
                  <ListItem 
                    key={index} 
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { bgcolor: 'action.hover' },
                      border: '2px solid #e0e0e0',
                      mb: 2,
                      borderRadius: 3,
                      p: 2
                    }}
                    onClick={() => setReplyMessage(template)}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {template}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderAnalytics = () => (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
        📊 ADVANCED ANALYTICS & REPORTING
      </Typography>
      
      <Grid container spacing={4}>
        {/* Risk Trend Analysis */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                📈 7-Day Risk Trend Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={500}>
                <AreaChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="low" stackId="1" stroke="#4caf50" fill="#4caf50" name="Low Risk" />
                  <Area type="monotone" dataKey="moderate" stackId="1" stroke="#ff9800" fill="#ff9800" name="Moderate Risk" />
                  <Area type="monotone" dataKey="high" stackId="1" stroke="#f44336" fill="#f44336" name="High Risk" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Emotion Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                😊 Emotion Analysis Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart data={emotionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2196f3" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* System Performance */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                🖥️ AI Model Performance
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Model Accuracy</Typography>
                <LinearProgress
                  variant="determinate"
                  value={systemMetrics.accuracy * 100}
                  sx={{ height: 15, borderRadius: 8 }}
                />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                  {(systemMetrics.accuracy * 100).toFixed(1)}%
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>System Uptime</Typography>
                <LinearProgress
                  variant="determinate"
                  value={systemMetrics.uptime}
                  color="success"
                  sx={{ height: 15, borderRadius: 8 }}
                />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                  {systemMetrics.uptime.toFixed(1)}%
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 3 }}>
                Model Version: v{systemMetrics.modelVersion}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderAssessmentReports = () => (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
        📑 Assessment Intelligence Console
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, boxShadow: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Average Wellbeing Score
            </Typography>
            <Typography variant="h2" color="primary">
              {(assessmentSummary.averageScore * 100).toFixed(1)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={assessmentSummary.averageScore * 100}
              sx={{ mt: 2, height: 10, borderRadius: 5 }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, boxShadow: 4 }}>
            <Typography variant="body1" color="text.secondary">
              High Risk Share
            </Typography>
            <Typography variant="h2" color="error">
              {assessmentSummary.highRiskShare.toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Requires immediate attention
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, boxShadow: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Moderate Risk Share
            </Typography>
            <Typography variant="h2" color="warning.main">
              {assessmentSummary.moderateRiskShare.toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor for early interventions
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, mb: 4, boxShadow: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search by User ID"
              value={assessmentSearch}
              onChange={(e) => setAssessmentSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={assessmentRiskFilter}
                label="Risk Level"
                onChange={(e) => setAssessmentRiskFilter(e.target.value as 'all' | 'low' | 'moderate' | 'high')}
              >
                <MenuItem value="all">All Risk Levels</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="moderate">Moderate</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={assessmentRange}
                label="Time Range"
                onChange={(e) => setAssessmentRange(e.target.value as '7' | '30' | '90' | 'all')}
              >
                <MenuItem value="7">Last 7 days</MenuItem>
                <MenuItem value="30">Last 30 days</MenuItem>
                <MenuItem value="90">Last 90 days</MenuItem>
                <MenuItem value="all">All assessments</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredAssessments.length} assessments
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleAssessmentExport}
              sx={{ fontWeight: 600 }}
            >
              Export CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ boxShadow: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1a1a1a' }}>
              <TableCell sx={{ color: 'white' }}>User ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Risk Level</TableCell>
              <TableCell sx={{ color: 'white' }}>Risk Score</TableCell>
              <TableCell sx={{ color: 'white' }}>Emotion</TableCell>
              <TableCell sx={{ color: 'white' }}>Timestamp</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssessments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
                    No assessments match the selected filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {filteredAssessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell>{getUserDisplayLabel(assessment.userId)}</TableCell>
                <TableCell>
                  <Chip
                    label={assessment.riskLevel.toUpperCase()}
                    color={
                      assessment.riskLevel === 'low'
                        ? 'success'
                        : assessment.riskLevel === 'moderate'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </TableCell>
                <TableCell>{(assessment.riskScore * 100).toFixed(1)}%</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>
                  {assessment.emotionType || 'neutral'}
                </TableCell>
                <TableCell>{new Date(assessment.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => openAssessmentDetails(assessment)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderReviewManagement = () => {
    const averageRating = allReviews.length
      ? allReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / allReviews.length
      : 0;
    const featuredCount = allReviews.filter(review => review.featured).length;
    const flaggedCount = allReviews.filter(review => review.flagged).length;

    return (
      <Box>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
          ⭐ Review Management & Community Trust
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, boxShadow: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Average Rating
              </Typography>
              <Typography variant="h2" color="primary">
                {averageRating.toFixed(1)} / 5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {allReviews.length} total reviews
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, boxShadow: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Featured Reviews
              </Typography>
              <Typography variant="h2" color="success.main">
                {featuredCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Highlighted on the user dashboard
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, boxShadow: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Flagged Reviews
              </Typography>
              <Typography variant="h2" color="warning.main">
                {flaggedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending moderation
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 4, mb: 4, boxShadow: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search reviews"
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                placeholder="Search by author or keywords"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={reviewFilter}
                  label="Filter"
                  onChange={(e) => setReviewFilter(e.target.value as 'all' | 'featured' | 'flagged')}
                >
                  <MenuItem value="all">All reviews</MenuItem>
                  <MenuItem value="featured">Featured only</MenuItem>
                  <MenuItem value="flagged">Flagged for action</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <List sx={{ boxShadow: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
              {filteredReviews.length === 0 && (
                <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography>No reviews found for the current filters.</Typography>
                </Box>
              )}
              {filteredReviews.map((review) => (
                <React.Fragment key={review.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 3, py: 2 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h6">{review.userName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {review.userRole} • {new Date(review.timestamp).toLocaleDateString()}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Rating size="small" value={review.rating} readOnly />
                              {review.category && (
                                <Chip label={review.category} size="small" sx={{ textTransform: 'capitalize' }} />
                              )}
                              {review.featured && (
                                <Chip label="Featured" size="small" color="success" variant="outlined" />
                              )}
                              {review.flagged && (
                                <Chip label="Flagged" size="small" color="warning" variant="outlined" />
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant={review.featured ? 'outlined' : 'contained'}
                              size="small"
                              onClick={() => handleReviewToggleFeatured(review)}
                            >
                              {review.featured ? 'Unfeature' : 'Feature'}
                            </Button>
                            <Button
                              variant="text"
                              color="error"
                              size="small"
                              onClick={() => handleReviewDelete(review)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                          "{review.comment}"
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, boxShadow: 4 }}>
              <Typography variant="h6" gutterBottom>
                Moderation Notes
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Feature high quality, detailed reviews to build trust." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Flag reviews that disclose sensitive personal information." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Reply to critical reviews within 24h to show responsiveness." />
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderSystemControl = () => (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
        🛠️ System Control & Automation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4, boxShadow: 4 }}>
            <Typography variant="h5" gutterBottom>
              Threshold Configuration
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Accuracy Threshold ({(systemSettingsDraft.accuracyThreshold * 100).toFixed(0)}%)
              </Typography>
              <Slider
                min={0.6}
                max={0.99}
                step={0.01}
                value={systemSettingsDraft.accuracyThreshold}
                onChange={(_, value) =>
                  setSystemSettingsDraft(prev => ({ ...prev, accuracyThreshold: value as number }))
                }
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Risk Sensitivity ({(systemSettingsDraft.riskSensitivity * 100).toFixed(0)}%)
              </Typography>
              <Slider
                min={0.5}
                max={0.95}
                step={0.01}
                value={systemSettingsDraft.riskSensitivity}
                onChange={(_, value) =>
                  setSystemSettingsDraft(prev => ({ ...prev, riskSensitivity: value as number }))
                }
                color="warning"
              />
            </Box>
            <FormControlLabel
              sx={{ mt: 2 }}
              control={
                <Switch
                  checked={systemSettingsDraft.autoAlerts}
                  onChange={(e) =>
                    setSystemSettingsDraft(prev => ({ ...prev, autoAlerts: e.target.checked }))
                  }
                />
              }
              label="Enable automated high-risk alerts"
            />
            <TextField
              sx={{ mt: 3 }}
              label="Data Retention (days)"
              type="number"
              value={systemSettingsDraft.dataRetention}
              onChange={(e) =>
                setSystemSettingsDraft(prev => ({ ...prev, dataRetention: Number(e.target.value) }))
              }
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button variant="contained" onClick={saveSystemSettings} sx={{ fontWeight: 700 }}>
                Save Settings
              </Button>
              <Button variant="outlined" onClick={() => setSystemSettingsDraft(systemSettings)}>
                Reset
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 4, boxShadow: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" gutterBottom>
              Automation Shortcuts
            </Typography>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={() => {
                updateSystemMetrics();
                logLiveAction('Manual metrics refresh executed');
                pushSystemNotification('System metrics refreshed successfully', 'success');
              }}
            >
              Refresh Metrics
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => {
                refreshData();
                logLiveAction('Synced data from local storage');
                pushSystemNotification('Local data reloaded', 'info');
              }}
            >
              Sync Local Storage
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => {
                const demoIds = assessments
                  .filter(a => typeof a.id === 'string' && a.id.startsWith('demo-'))
                  .map(a => a.id as string);
                if (demoIds.length === 0) {
                  alert('No demo assessments detected.');
                  return;
                }
                deleteAssessmentsByIds(demoIds);
                logLiveAction(`Purged ${demoIds.length} demo assessments`);
                pushSystemNotification(`Removed ${demoIds.length} demo assessments`, 'warning');
              }}
            >
              Clean Demo Data
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderLiveMonitoring = () => {
    const liveFeed = activity.slice(0, 10);
    const highRiskQueue = assessments
      .filter(a => a.riskLevel === 'high')
      .slice(-5)
      .reverse();

    return (
      <Box>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
          📡 Live Monitoring & Escalation
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, boxShadow: 4 }}>
              <Typography variant="h5" gutterBottom>
                Real-time Activity Feed
              </Typography>
              <List sx={{ maxHeight: 420, overflow: 'auto' }}>
                {liveFeed.map((item, index) => (
                  <ListItem key={`${item.timestamp}-${index}`} sx={{ borderBottom: '1px solid #eee' }}>
                    <ListItemIcon>
                      {item.type === 'assessment' ? <Assessment color="primary" /> : <Chat color="secondary" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatActivityMessage(item)}
                        </Typography>
                      }
                      secondary={new Date(item.timestamp).toLocaleString()}
                    />
                    {item.riskLevel === 'high' && (
                      <Chip label="High" color="error" size="small" sx={{ fontWeight: 700 }} />
                    )}
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, boxShadow: 4 }}>
              <Typography variant="h6" gutterBottom>
                Response Time Trend
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsLineChart data={latencyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="latency" stroke="#1976d2" strokeWidth={2} name="Latency (ms)" />
                </RechartsLineChart>
              </ResponsiveContainer>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Uptime: {systemMetrics.uptime.toFixed(2)}%
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, boxShadow: 4 }}>
              <Typography variant="h6" gutterBottom>
                High-Risk Queue
              </Typography>
              <List dense>
                {highRiskQueue.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No high-risk assessments pending." />
                  </ListItem>
                )}
                {highRiskQueue.map((assessment) => (
                  <ListItem key={assessment.id}>
                    <ListItemText
                      primary={getUserDisplayLabel(assessment.userId)}
                      secondary={new Date(assessment.timestamp).toLocaleString()}
                    />
                    <Button size="small" onClick={() => openAssessmentDetails(assessment)}>
                      View
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, boxShadow: 4 }}>
              <Typography variant="h6" gutterBottom>
                Action Log
              </Typography>
              <List dense>
                {liveActionsLog.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No manual actions recorded yet." />
                  </ListItem>
                )}
                {liveActionsLog.map((entry, index) => (
                  <ListItem key={`${entry}-${index}`}>
                    <ListItemText primary={entry} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, boxShadow: 4 }}>
              <Typography variant="h6" gutterBottom>
                Escalation Controls
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="error"
                sx={{ mb: 2 }}
                onClick={() => logLiveAction('Crisis escalation protocol triggered')}
              >
                Trigger Crisis Escalation
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                onClick={() => logLiveAction('Broadcasted reassurance message to users')}
              >
                Broadcast Update
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  updateSystemMetrics();
                  logLiveAction('Live monitoring refreshed manually');
                }}
              >
                Refresh Live Feed
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'overview': return renderSystemOverview();
      case 'users': return renderUserManagement();
      case 'chats': return renderChatManagement();
      case 'analytics': return renderAnalytics();
      case 'assessments': return renderAssessmentReports();
      case 'reviews': return renderReviewManagement();
      case 'system': return renderSystemControl();
      case 'monitoring': return renderLiveMonitoring();
      default: return renderSystemOverview();
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      {/* Admin Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 320,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
            bgcolor: '#1a1a1a',
            color: 'white',
            borderRight: '4px solid #ff6b35'
          },
        }}
      >
        <Box sx={{ p: 4, borderBottom: '2px solid #333' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <AdminPanelSettings sx={{ fontSize: 50, color: '#ff6b35' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#ff6b35' }}>
                ADMIN CONTROL
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 600 }}>
                System Administrator
              </Typography>
            </Box>
          </Box>
        </Box>

        <List sx={{ pt: 3 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.id}
              selected={selectedSection === item.id}
              onClick={() => setSelectedSection(item.id)}
              sx={{
                mx: 2,
                mb: 2,
                borderRadius: 3,
                py: 2,
                '&.Mui-selected': {
                  bgcolor: '#ff6b35',
                  '&:hover': { bgcolor: '#ff6b35' }
                },
                '&:hover': { bgcolor: '#333' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 50 }}>
                <Box sx={{ fontSize: 28 }}>{item.icon}</Box>
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{ '& .MuiListItemText-primary': { fontWeight: 700, fontSize: '1.1rem' } }}
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ mt: 'auto', p: 3, borderTop: '2px solid #333' }}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<Logout />}
            onClick={logout}
            size="large"
            sx={{ py: 2, fontSize: '1.1rem', fontWeight: 700 }}
          >
            Logout Admin
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 4 } }}>
        {/* Top Bar */}
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: { xs: 2, sm: 3, md: 4 }, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          boxShadow: 4,
          borderRadius: 3
        }}>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 800, 
              color: '#1a1a1a',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
            }}>
              AI Healthcare Admin Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              mt: { xs: 0.5, sm: 0 }
            }}>
              Complete system control and monitoring
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 } }}>
            <Badge badgeContent={systemAlerts.length} color="error">
              <IconButton 
                color="inherit"
                sx={{ 
                  bgcolor: 'primary.light', 
                  width: { xs: 48, sm: 60 }, 
                  height: { xs: 48, sm: 60 }
                }}
                onClick={() => setNotificationsOpen(true)}
              >
                <NotificationsActive sx={{ fontSize: { xs: 24, sm: 30 } }} />
              </IconButton>
            </Badge>
            <IconButton onClick={() => setProfileOpen(true)} sx={{ p: 0 }}>
              <Avatar sx={{ 
                bgcolor: 'error.main', 
                width: { xs: 48, sm: 60 }, 
                height: { xs: 48, sm: 60 }
              }}>
                <SupervisorAccount sx={{ fontSize: { xs: 24, sm: 30 } }} />
              </Avatar>
            </IconButton>
          </Box>
        </Paper>

        {/* Content Area */}
        {renderContent()}
      </Box>

      {/* User Details Dialog */}
      <Dialog
        open={userDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            👤 Complete User Profile: {selectedUser?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    📊 User Statistics
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><Assessment sx={{ fontSize: 30 }} /></ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="h6">Total Assessments</Typography>}
                        secondary={<Typography variant="h4" color="primary">{assessments.filter(a => a.userId === selectedUser.id).length}</Typography>}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><TrendingUp sx={{ fontSize: 30 }} /></ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="h6">Average Risk Score</Typography>}
                        secondary={<Typography variant="h4" color="warning">{`${(assessments.filter(a => a.userId === selectedUser.id).reduce((sum, a) => sum + a.riskScore, 0) / assessments.filter(a => a.userId === selectedUser.id).length * 100 || 0).toFixed(1)}%`}</Typography>}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4, maxHeight: 500, overflow: 'auto' }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    📈 Assessment History
                  </Typography>
                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography variant="h6">Date</Typography></TableCell>
                        <TableCell><Typography variant="h6">Risk</Typography></TableCell>
                        <TableCell><Typography variant="h6">Score</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assessments
                        .filter(a => a.userId === selectedUser.id)
                        .slice(0, 10)
                        .map((assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell>
                              <Typography variant="body1">
                                {new Date(assessment.timestamp).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={assessment.riskLevel}
                                color={
                                  assessment.riskLevel === 'low' ? 'success' :
                                  assessment.riskLevel === 'moderate' ? 'warning' : 'error'
                                }
                                size="medium"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">
                                {(assessment.riskScore * 100).toFixed(1)}%
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)} size="large">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Chat Reply Dialog */}
      <Dialog
        open={chatDialogOpen}
        onClose={() => setChatDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            💬 Reply to Support Message
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedChat && (
            <Box>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Original Message:
              </Typography>
              <Paper sx={{ p: 4, mb: 4, bgcolor: 'grey.100', border: '3px solid #ddd' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  "{selectedChat.message}"
                </Typography>
              </Paper>
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Your Admin Response"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your professional response to help the user..."
                variant="outlined"
                size="large"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatDialogOpen(false)} size="large">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleChatReply}
            startIcon={<Send />}
            disabled={!replyMessage.trim()}
            size="large"
            sx={{ py: 2, px: 4, fontWeight: 700 }}
          >
            Send Admin Reply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assessment Detail Dialog */}
      <Dialog
        open={assessmentDialogOpen}
        onClose={() => setAssessmentDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Assessment Detail
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedAssessmentRecord && (
            <Box>
              <Typography variant="h6" gutterBottom>
                User: {getUserDisplayLabel(selectedAssessmentRecord.userId)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Risk Level:{' '}
                <Chip
                  label={selectedAssessmentRecord.riskLevel}
                  color={
                    selectedAssessmentRecord.riskLevel === 'low'
                      ? 'success'
                      : selectedAssessmentRecord.riskLevel === 'moderate'
                      ? 'warning'
                      : 'error'
                  }
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Recorded on {new Date(selectedAssessmentRecord.timestamp).toLocaleString()}
              </Typography>

              <List>
                {Array.isArray(selectedAssessmentRecord.metrics) && selectedAssessmentRecord.metrics.length > 0 ? (
                  selectedAssessmentRecord.metrics.map((metric: any) => (
                    <ListItem key={metric.category}>
                      <ListItemText
                        primary={`${metric.category} • ${(metric.score * 100).toFixed(0)}%`}
                        secondary={metric.interpretation}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No metric breakdown available." />
                  </ListItem>
                )}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleAssessmentDelete}>
            Delete Record
          </Button>
          <Button onClick={() => setAssessmentDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            🔔 System Notifications
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {combinedNotifications.length === 0 ? (
            <Typography color="text.secondary">No notifications yet.</Typography>
          ) : (
            <List>
              {combinedNotifications.map(note => (
                <ListItem key={note.id} sx={{ borderBottom: '1px solid #eee' }}>
                  <ListItemText
                    primary={note.message}
                    secondary={new Date(note.timestamp).toLocaleString()}
                  />
                  <Chip label={note.severity || 'info'} size="small" color={note.severity || 'info'} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            👩‍💼 Admin Overview
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            <ListItem>
              <ListItemText primary="Total Users" secondary={analytics.totalUsers} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Assessments Logged" secondary={analytics.totalAssessments} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Pending Chat Requests" secondary={pendingChats.length} />
            </ListItem>
            <ListItem>
              <ListItemText primary="High-Risk Users" secondary={analytics.highRiskUsers} />
            </ListItem>
          </List>
          <Typography variant="body2" color="text.secondary">
            Stay vigilant—review live monitoring and respond to escalations promptly.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AdminDashboard;