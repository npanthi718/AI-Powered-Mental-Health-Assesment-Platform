import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider
} from '@mui/material';
import { Gavel, Checklist, AccessTime, EmojiPeople, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  const commitments = [
    {
      icon: <Checklist color="primary" />,
      title: 'Appropriate Use',
      description: 'You agree to use the platform for wellness monitoring, not as a replacement for emergency medical services.'
    },
    {
      icon: <AccessTime color="primary" />,
      title: 'Account Responsibility',
      description: 'Safeguard your credentials and notify administrators of suspicious activity immediately.'
    },
    {
      icon: <EmojiPeople color="primary" />,
      title: 'Community Care',
      description: 'Treat support specialists and fellow users respectfully. Threatening language may result in account suspension.'
    }
  ];

  const clauses = [
    {
      title: '1. Service Description',
      items: [
        'The platform provides AI-assisted assessments, wellness activities, and anonymous chat support.',
        'Results are guidance only and do not constitute clinical diagnosis or treatment.',
        'High-risk responses trigger alerts to administrators for immediate review.'
      ]
    },
    {
      title: '2. Eligibility & Accounts',
      items: [
        'You must be at least 16 years old or have guardian consent.',
        'Provide accurate registration details and update them if they change.',
        'Administrators may suspend access if terms are violated or security risks are detected.'
      ]
    },
    {
      title: '3. Data & Security',
      items: [
        'We follow the Privacy Policy regarding collection, storage, and sharing.',
        'Emotion detection requires explicit camera permission and can be disabled anytime.',
        'Exports should be stored securely and handled according to HIPAA-style safeguards.'
      ]
    },
    {
      title: '4. Limitation of Liability',
      items: [
        'We strive for uninterrupted service but do not guarantee continuous availability.',
        'The platform is not liable for decisions made solely on AI-generated insights.',
        'In case of disputes, binding arbitration will be used where permitted by law.'
      ]
    }
  ];

  return (
    <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 5, mb: 4, textAlign: 'center' }}>
          <Gavel sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Terms of Service
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Effective Date: January 1, 2025 &nbsp;|&nbsp; Last Updated: November 2025
          </Typography>
          <Typography variant="body1" sx={{ mt: 3 }}>
            By creating an account or using the AI-Powered Mental HealthCare Platform, you agree to the commitments and policies below.
          </Typography>
        </Paper>

        <Box sx={{ display: 'grid', gap: 3, mb: 4, gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' } }}>
          {commitments.map((commitment) => (
            <Paper key={commitment.title} sx={{ p: 3 }}>
              {commitment.icon}
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                {commitment.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {commitment.description}
              </Typography>
            </Paper>
          ))}
        </Box>

        {clauses.map((clause) => (
          <Paper key={clause.title} sx={{ p: 4, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              {clause.title}
            </Typography>
            <List dense>
              {clause.items.map((item, index) => (
                <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                  <ListItemIcon>
                    <Checklist color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Acceptance
          </Typography>
          <Typography variant="body1" paragraph>
            By selecting “I agree” during registration—or by continuing to use the service—you confirm that you have read the Terms of Service and Privacy Policy. If you disagree, please discontinue use and contact support for account deletion.
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

export default TermsOfService;

