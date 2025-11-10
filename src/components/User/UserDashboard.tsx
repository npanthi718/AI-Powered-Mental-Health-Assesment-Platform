import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Tab,
  Tabs,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material';
import {
  Psychology,
  Assessment,
  Chat,
  Person,
  Logout,
  TrendingUp,
  Security,
  Star
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import AssessmentForm from './AssessmentForm';
import ChatSupport from './ChatSupport';
import UserProfile from './UserProfile';
import ReviewSystem from './ReviewSystem';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { getUserAssessments } = useData();
  const [tabValue, setTabValue] = useState(0);

  const userAssessments = getUserAssessments(user?.id || '');
  const latestAssessment = userAssessments[userAssessments.length - 1];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'moderate': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box className="dashboard-container">
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'primary.main', boxShadow: 1 }}>
        <Toolbar>
          <Psychology sx={{ fontSize: 28, mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mental Health Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              {user?.name.charAt(0)}
            </Avatar>
            <Typography variant="body2">{user?.name}</Typography>
            <Button
              color="inherit"
              onClick={logout}
              startIcon={<Logout />}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Your mental health journey matters. Take a moment to check in with yourself today.
          </Typography>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Assessment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6">Total Assessments</Typography>
                <Typography variant="h4" color="primary">
                  {userAssessments.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6">Latest Risk Level</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={latestAssessment?.riskLevel || 'No assessment'}
                    color={getRiskColor(latestAssessment?.riskLevel || 'default')}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Security sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6">Privacy Status</Typography>
                <Typography variant="h4" color="secondary">
                  Secure
                </Typography>
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
            <Tab icon={<Assessment />} label="New Assessment" />
            <Tab icon={<Chat />} label="Chat Support" />
            <Tab icon={<Person />} label="My Profile" />
            <Tab icon={<Star />} label="Reviews" />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <AssessmentForm />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <ChatSupport />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <UserProfile />
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <ReviewSystem />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserDashboard;