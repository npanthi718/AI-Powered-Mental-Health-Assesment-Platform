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
  Area
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    assessments, 
    chatMessages, 
    systemMetrics, 
    getAllUsers, 
    updateUserStatus, 
    deleteUser,
    getAnalytics,
    getRealTimeActivity,
    getReviews,
    submitChatMessage,
    updateSystemMetrics
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
        response: 'admin'
      });
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

  const analytics = getAnalytics();
  const users = getAllUsers();
  const activity = getRealTimeActivity();
  const reviews = getReviews();
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
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 4, minHeight: 520 }}>
            <CardContent sx={{ maxHeight: 700, overflow: 'auto' }}>
              <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 700 }}>
                🔴 LIVE SYSTEM ACTIVITY
                <Chip label="LIVE" color="error" size="medium" sx={{ animation: 'pulse 2s infinite', fontWeight: 700 }} />
              </Typography>
              <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                <List>
                  {activity.slice(0, 15).map((item, index) => {
                    // Try to get user's full name from users list
                    let userName = '';
                    if (item.userId) {
                      const userObj = users.find(u => u.id === item.userId);
                      userName = userObj && typeof userObj.name === 'string' && userObj.name.length > 0 ? userObj.name : item.userId;
                    }
                    const messageText = item.type === 'assessment'
                      ? `User ${userName} completed mental health assessment`
                      : item.message;
                    return (
                      <ListItem key={index} sx={{ 
                        border: '2px solid #e0e0e0', 
                        mb: 2, 
                        borderRadius: 3,
                        bgcolor: item.riskLevel === 'high' ? '#ffebee' : 'white',
                        boxShadow: 2
                      }}>
                        <ListItemIcon>
                          {item.type === 'assessment' ? 
                            <Assessment color={item.riskLevel === 'high' ? 'error' : 'primary'} sx={{ fontSize: 30 }} /> :
                            <Chat color="secondary" sx={{ fontSize: 30 }} />
                          }
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {messageText}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body1" color="text.secondary">
                              {new Date(item.timestamp).toLocaleString()}
                            </Typography>
                          }
                        />
                        {item.riskLevel === 'high' && (
                          <Chip label="🚨 HIGH RISK" color="error" size="large" sx={{ fontWeight: 700 }} />
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
          <Card sx={{ boxShadow: 4, minHeight: 520 }}>
            <CardContent sx={{ maxHeight: 700, overflow: 'auto' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
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

  const renderContent = () => {
    switch (selectedSection) {
      case 'overview': return renderSystemOverview();
      case 'users': return renderUserManagement();
      case 'chats': return renderChatManagement();
      case 'analytics': return renderAnalytics();
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
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        {/* Top Bar */}
        <Paper sx={{ p: 3, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
              AI Healthcare Admin Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Complete system control and monitoring
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Badge badgeContent={systemAlerts.length} color="error">
              <IconButton 
                color="inherit"
                sx={{ bgcolor: 'primary.light', width: 60, height: 60 }}
              >
                <NotificationsActive sx={{ fontSize: 30 }} />
              </IconButton>
            </Badge>
            <Avatar sx={{ bgcolor: 'error.main', width: 60, height: 60 }}>
              <SupervisorAccount sx={{ fontSize: 30 }} />
            </Avatar>
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
    </Box>
  );
};

export default AdminDashboard;