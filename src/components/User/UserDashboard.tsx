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
    <Box className="dashboard-container" sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'primary.main', boxShadow: 2 }}>
        <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Psychology sx={{ fontSize: { xs: 24, sm: 28 }, mr: { xs: 1, sm: 2 } }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' } }}>
            Mental Health Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'nowrap' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}>
              {user?.name.charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>{user?.name}</Typography>
            <Button
              color="inherit"
              onClick={logout}
              startIcon={<Logout />}
              size="small"
              sx={{ ml: { xs: 0, sm: 2 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Logout</Box>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Welcome Section */}
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: { xs: 2, sm: 3 }, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          borderRadius: 3,
          boxShadow: 4
        }}>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Your mental health journey matters. Take a moment to check in with yourself today.
          </Typography>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              textAlign: 'center', 
              p: { xs: 1.5, sm: 2 }, 
              height: '100%',
              borderRadius: 3,
              boxShadow: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}>
              <CardContent>
                <Assessment sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Total Assessments</Typography>
                <Typography variant="h4" color="primary" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                  {userAssessments.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              textAlign: 'center', 
              p: { xs: 1.5, sm: 2 }, 
              height: '100%',
              borderRadius: 3,
              boxShadow: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}>
              <CardContent>
                <TrendingUp sx={{ fontSize: { xs: 32, sm: 40 }, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Latest Risk Level</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={latestAssessment?.riskLevel || 'No assessment'}
                    color={getRiskColor(latestAssessment?.riskLevel || 'default')}
                    sx={{ textTransform: 'capitalize', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              textAlign: 'center', 
              p: { xs: 1.5, sm: 2 }, 
              height: '100%',
              borderRadius: 3,
              boxShadow: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}>
              <CardContent>
                <Security sx={{ fontSize: { xs: 32, sm: 40 }, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Privacy Status</Typography>
                <Typography variant="h4" color="secondary" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                  Secure
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Paper sx={{ width: '100%', borderRadius: 3, boxShadow: 4, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: { xs: 48, sm: 64 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 }
              }
            }}
          >
            <Tab icon={<Assessment />} iconPosition="start" label="New Assessment" />
            <Tab icon={<Chat />} iconPosition="start" label="Chat Support" />
            <Tab icon={<Person />} iconPosition="start" label="My Profile" />
            <Tab icon={<Star />} iconPosition="start" label="Reviews" />
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