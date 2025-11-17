import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import { PrivacyTip, Shield, Security, Gavel, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  const principles = [
    {
      icon: <Shield color="primary" />,
      title: 'Data Minimization',
      description: 'We only store information necessary to deliver assessments, chat transcripts, and improvement analytics. You can clear your local history at any moment.'
    },
    {
      icon: <Security color="primary" />,
      title: 'On-Device Processing',
      description: 'Emotion analysis, assessment scoring, and chat recommendations happen inside your browser. No biometric data leaves your device.'
    },
    {
      icon: <PrivacyTip color="primary" />,
      title: 'User Control',
      description: 'Users decide when to share results with administrators, when to export data, and when to delete their assessments or chat histories.'
    }
  ];

  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Basic account details: name, email, encrypted password.',
        'Assessment inputs: emotion readings, question responses, activity completion data.',
        'Support chats: conversation transcripts, timestamps, escalation status.',
        'System telemetry: anonymized performance metrics to improve reliability.'
      ]
    },
    {
      title: 'How We Use Information',
      content: [
        'Generate personalized mental wellness insights and track improvements.',
        'Provide anonymous support responses or escalate messages to verified admins.',
        'Maintain system reliability, security, and regulatory compliance.',
        'Communicate important product or crisis updates.'
      ]
    },
    {
      title: 'Your Rights & Choices',
      content: [
        'Access and export assessment summaries from the dashboard.',
        'Clear chat histories or assessment data directly from the interface.',
        'Control camera/microphone permissions for live monitoring modules.',
        'Contact the support team for account deletion or additional requests.'
      ]
    }
  ];

  return (
    <Box sx={{ bgcolor: '#f6f7fb', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 5, mb: 4, textAlign: 'center' }}>
          <PrivacyTip sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Privacy Policy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Effective Date: January 1, 2025 &nbsp;|&nbsp; Last Updated: November 2025
          </Typography>
          <Typography variant="body1" sx={{ mt: 3 }}>
            We built the AI-Powered Mental HealthCare Platform with privacy-first principles. This policy
            explains what information we collect, how we use it, and the choices you control.
          </Typography>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {principles.map((principle) => (
            <Grid item xs={12} md={4} key={principle.title}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ mb: 2 }}>{principle.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {principle.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {principle.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {sections.map((section) => (
          <Paper key={section.title} sx={{ p: 4, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              {section.title}
            </Typography>
            <List dense>
              {section.content.map((item, index) => (
                <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                  <ListItemIcon>
                    <Gavel color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Contact & Compliance
          </Typography>
          <Typography variant="body1" paragraph>
            For privacy questions or data requests, contact privacy@ai-mentalhealth.com. We respond to verified requests within 30 days.
          </Typography>
          <Typography variant="body1" paragraph>
            If we update this policy, we will highlight changes inside the dashboard and require you to acknowledge them before continuing.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;

