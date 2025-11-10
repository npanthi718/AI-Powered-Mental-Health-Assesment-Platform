import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import {
  Psychology,
  Security,
  Analytics,
  Assessment,
  Chat,
  TrendingUp,
  Shield,
  Speed,
  CheckCircle,
  Login,
  PersonAdd,
  Menu,
  Close,
  Star,
  Verified,
  HealthAndSafety,
  SmartToy,
  Insights,
  DataUsage
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { getReviews } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const reviews = getReviews().slice(0, 6); // Show more reviews

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'AI-Powered Risk Assessment',
      description: 'Advanced machine learning algorithms analyze mental health patterns with 87% accuracy',
      stats: '15 Standardized Questions'
    },
    {
      icon: <SmartToy sx={{ fontSize: 40, color: '#26a69a' }} />,
      title: 'Real-time Emotion Detection',
      description: 'Webcam-based facial emotion recognition for comprehensive assessment',
      stats: '5 Emotion Types Detected'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#ff9800' }} />,
      title: 'Comprehensive Analytics',
      description: 'Real-time dashboards with trend analysis and personalized insights',
      stats: 'Live Data Processing'
    },
    {
      icon: <Shield sx={{ fontSize: 40, color: '#4caf50' }} />,
      title: 'HIPAA Compliant Security',
      description: 'End-to-end encryption with anonymization options for complete privacy',
      stats: 'Bank-level Security'
    },
    {
      icon: <Chat sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: '24/7 Anonymous Support',
      description: 'Instant chat support with trained counselors and crisis resources',
      stats: 'Always Available'
    },
    {
      icon: <Insights sx={{ fontSize: 40, color: '#f44336' }} />,
      title: 'Research-Grade Data',
      description: 'Academic-quality analytics with export capabilities for research',
      stats: 'Publication Ready'
    }
  ];

  const { getAnalytics, systemMetrics } = useData();
  const analytics = getAnalytics();

  const stats = [
    { 
      number: analytics.totalAssessments.toString(), 
      label: 'Assessments Completed', 
      icon: <Assessment /> 
    },
    { 
      number: `${Math.round(systemMetrics.accuracy * 100)}%`, 
      label: 'AI Accuracy Rate', 
      icon: <TrendingUp /> 
    },
    { 
      number: '24/7', 
      label: 'Support Available', 
      icon: <HealthAndSafety /> 
    },
    { 
      number: `${systemMetrics.uptime.toFixed(1)}%`, 
      label: 'System Uptime', 
      icon: <Speed /> 
    }
  ];

  const testimonials = [
    ...reviews.map(review => ({
      name: review.userName,
      role: review.userRole,
      avatar: review.userName.split(' ').map((n: string) => n[0]).join(''),
      text: review.comment,
      rating: review.rating
    }))
  ];

  return (
    <Box>
      {/* Navigation */}
      <AppBar position="fixed" sx={{ bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', color: 'primary.main' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Psychology sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
              AI HealthCare Bolt
            </Typography>
          </Box>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="contained" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </Box>
          
          <IconButton
            sx={{ display: { xs: 'block', md: 'none' } }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <Close /> : <Menu />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pt: 12,
          pb: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" gutterBottom sx={{ fontWeight: 800 }}>
                AI-Powered Mental Health
                <Box component="span" sx={{ color: '#4fc3f7', display: 'block' }}>
                  Risk Assessment
                </Box>
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
                Revolutionary healthcare technology combining artificial intelligence, 
                emotion detection, and real-time analytics for comprehensive mental health evaluation.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                  startIcon={<PersonAdd />}
                >
                  Start Free Assessment
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: '#f5f5f5', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  startIcon={<Login />}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                  '& .floating': {
                    animation: 'float 3s ease-in-out infinite',
                  },
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' }
                  }
                }}
              >
                <Paper
                  className="floating"
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Psychology sx={{ fontSize: 80, color: 'white', mb: 2 }} />
                  <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>
                    87% Accuracy
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    AI-Powered Analysis
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: 8, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Advanced Healthcare Technology
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Cutting-edge AI and machine learning for accurate mental health assessment
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  p: 3,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #1976d2, #26a69a)',
                  }
                }}
              >
                <Box sx={{ mb: 3 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {feature.description}
                </Typography>
                <Chip
                  label={feature.stats}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works */}
      <Box sx={{ bgcolor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
              How It Works
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Simple, secure, and scientifically validated process
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>1</Typography>
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Complete Assessment
                </Typography>
                <Typography color="text.secondary">
                  Answer 15 standardized mental health questions with optional webcam emotion detection
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 60, height: 60, mx: 'auto', mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>2</Typography>
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  AI Analysis
                </Typography>
                <Typography color="text.secondary">
                  Advanced machine learning algorithms process your responses for accurate risk assessment
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <Avatar sx={{ bgcolor: 'success.main', width: 60, height: 60, mx: 'auto', mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>3</Typography>
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Get Results
                </Typography>
                <Typography color="text.secondary">
                  Receive personalized recommendations and access to support resources
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Trusted by Healthcare Professionals
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Leading experts rely on our AI-powered assessment system
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ p: 4, height: '100%' }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
                  ))}
                </Box>
                <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                  "{testimonial.text}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {testimonial.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                  <Verified sx={{ color: 'primary.main', ml: 'auto' }} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Security & Privacy */}
      <Box sx={{ bgcolor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
                Enterprise-Grade Security
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                Your privacy and data security are our top priorities
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: 'success.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="HIPAA Compliant"
                    secondary="Full compliance with healthcare data protection standards"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: 'success.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="End-to-End Encryption"
                    secondary="All data encrypted in transit and at rest"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: 'success.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Anonymous Options"
                    secondary="Complete anonymization available for research"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: 'success.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Audit Trails"
                    secondary="Complete access logging and monitoring"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Shield sx={{ fontSize: 200, color: 'primary.main', opacity: 0.1 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #26a69a 100%)',
          color: 'white',
          py: 8
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of users who trust AI HealthCare Bolt for their mental health assessment needs
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
              startIcon={<PersonAdd />}
            >
              Create Free Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: '#f5f5f5', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
              startIcon={<Login />}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1a1a1a', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  AI HealthCare Bolt
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Revolutionary AI-powered mental health assessment system trusted by healthcare professionals worldwide.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Crisis Resources
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                National Suicide Prevention Lifeline: 988
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Crisis Text Line: Text HOME to 741741
              </Typography>
              <Typography variant="body2">
                SAMHSA National Helpline: 1-800-662-4357
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Important Notice
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                This tool provides wellness support only and is not diagnostic. 
                Please consult healthcare professionals for medical advice.
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © 2024 AI HealthCare Bolt. All rights reserved. | Privacy Policy | Terms of Service
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;