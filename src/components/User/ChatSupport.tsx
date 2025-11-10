import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Alert,
  FormControlLabel,
  Switch,
  Chip,
  Card
} from '@mui/material';
import { Send, Support, Person, SmartToy } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const ChatSupport: React.FC = () => {
  const { user } = useAuth();
  const { submitChatMessage, chatMessages } = useData();
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const userMessages = chatMessages.filter(msg => msg.userId === user?.id);
  const messagesRef = React.useRef<HTMLDivElement | null>(null);
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  // auto-scroll to bottom when messages change
  React.useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    // scroll to bottom smoothly
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
      if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    });
  }, [userMessages.length, chatMessages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    
    submitChatMessage({
      userId: user?.id || '',
      message: message.trim(),
      anonymous
    });

    setMessage('');
    setLoading(false);

    // Simulate auto-response after 2 seconds
    setTimeout(() => {
      submitChatMessage({
        userId: user?.id || '',
        message: getAutoResponse(),
        anonymous: true,
        response: 'system'
      });
    }, 2000);
  };

  const getAutoResponse = (): string => {
    const responses = [
      "Thank you for reaching out. A support specialist will review your message and respond within 24 hours.",
      "Your message has been received. In the meantime, remember that you're not alone and help is available.",
      "We appreciate you sharing your concerns. Please remember that if you're experiencing a crisis, contact emergency services immediately.",
      "Your wellbeing matters to us. A counselor will provide personalized guidance based on your message.",
      "Thank you for trusting us with your message. We're here to support you through this journey."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Anonymous Chat Support
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>24/7 Support Available:</strong> Our trained counselors are here to help. 
          If you're experiencing a mental health crisis, please contact emergency services 
          immediately or call the National Suicide Prevention Lifeline: 988
        </Typography>
      </Alert>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'stretch', minHeight: 480 }}>
        {/* Chat Messages */}
        <Paper sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Support Messages
          </Typography>
          
          <Box ref={messagesRef} sx={{ flex: 1, overflow: 'auto', mb: 2, pr: 1, display: 'flex', flexDirection: 'column' }}>
            {userMessages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Support sx={{ fontSize: 48, mb: 2 }} />
                <Typography>No messages yet. Start a conversation!</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                {userMessages.map((msg, idx) => {
                  const isUser = msg.userId === user?.id && !msg.response;
                  return (
                    <Box key={msg.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {!isUser && (
                          <Avatar sx={{ bgcolor: msg.response ? 'secondary.main' : 'primary.main' }}>
                            {msg.response ? <SmartToy /> : <Person />}
                          </Avatar>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {msg.response ? 'Support Team' : (msg.anonymous ? 'Anonymous User' : (isUser ? (user?.name || 'You') : user?.name))}
                          <Chip label={new Date(msg.timestamp).toLocaleTimeString()} size="small" sx={{ ml: 1 }} />
                        </Typography>
                        {isUser && (
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Person />
                          </Avatar>
                        )}
                      </Box>
                      <Box sx={{ maxWidth: '78%', display: 'inline-block' }}>
                        <Paper elevation={0} sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: isUser ? 'primary.main' : 'action.hover',
                          color: isUser ? 'primary.contrastText' : 'text.primary',
                          textAlign: isUser ? 'right' : 'left',
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere'
                        }}>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.message}</Typography>
                        </Paper>
                      </Box>
                      {idx !== userMessages.length - 1 && <Divider sx={{ width: '100%', mt: 2 }} />}
                    </Box>
                  );
                })}
                <div ref={bottomRef} />
              </Box>
            )}
          </Box>

          {/* Message Input */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  color="primary"
                />
              }
              label="Send anonymously"
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Share your thoughts, concerns, or questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !message.trim()}
                sx={{ minWidth: 60 }}
              >
                <Send />
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Support Resources */}
        <Paper sx={{ width: 300, p: 2, maxHeight: 'calc(100vh - 400px)', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Crisis Resources
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                🚨 EMERGENCY RESOURCES
              </Typography>
            </Alert>
            
            <Card sx={{ mb: 2, p: 2, bgcolor: '#ffebee', border: '2px solid #f44336' }}>
              <ListItemText
                primary="National Suicide Prevention Lifeline"
                secondary={
                  <Box>
                    <Typography variant="h6" color="error.main" sx={{ fontWeight: 700 }}>
                      988
                    </Typography>
                    <Typography variant="body2">24/7 Crisis Support</Typography>
                  </Box>
                }
              />
            </Card>
            
            <Card sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', border: '2px solid #2196f3' }}>
              <ListItemText
                primary="Crisis Text Line"
                secondary={
                  <Box>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                      Text HOME to 741741
                    </Typography>
                    <Typography variant="body2">24/7 Text Support</Typography>
                  </Box>
                }
              />
            </Card>
            
            <Card sx={{ mb: 2, p: 2, bgcolor: '#e8f5e8', border: '2px solid #4caf50' }}>
              <ListItemText
                primary="SAMHSA National Helpline"
                secondary={
                  <Box>
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
                      1-800-662-4357
                    </Typography>
                    <Typography variant="body2">Mental Health Services</Typography>
                  </Box>
                }
              />
            </Card>
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Self-Care Tips
          </Typography>
          
          <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
            <List dense>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText 
                  primary="🧘 Practice deep breathing exercises"
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem' } }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText 
                  primary="📱 Take regular breaks from screens"
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem' } }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText 
                  primary="👥 Stay connected with loved ones"
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem' } }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText 
                  primary="😴 Maintain a regular sleep schedule"
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem' } }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText 
                  primary="🏃 Engage in physical activity"
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem' } }}
                />
              </ListItem>
            </List>
          </Card>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatSupport;