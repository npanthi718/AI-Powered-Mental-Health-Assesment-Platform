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
  Card,
  useMediaQuery
} from '@mui/material';
import { Send, Support, Person, SmartToy } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const ChatSupport: React.FC = () => {
  const { user } = useAuth();
  const { submitChatMessage, chatMessages, clearChatMessagesForUser, markChatMessageHandled } = useData();
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const isTallViewport = useMediaQuery('(min-height:900px)');
  const chatPanelRef = React.useRef<HTMLDivElement | null>(null);
  const [chatPanelHeight, setChatPanelHeight] = useState<number | null>(null);

  const conversationId = React.useMemo(() => {
    if (user?.id) return user.id;
    if (typeof window === 'undefined') return 'guest-user';
    const stored = localStorage.getItem('guestChatId');
    if (stored) return stored;
    const generated = `guest-${Date.now()}`;
    localStorage.setItem('guestChatId', generated);
    return generated;
  }, [user?.id]);

  const currentUserId = conversationId;
  const userDisplayName = user?.name || 'You';
  const userMessages = chatMessages
    .filter(msg => msg.userId === currentUserId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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

  React.useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).ResizeObserver) return;
    const node = chatPanelRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setChatPanelHeight(entry.contentRect.height);
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [userMessages.length]);

  const clearConversation = () => {
    clearChatMessagesForUser(currentUserId);
  };

  const knowledgeBase = [
    {
      keywords: ['assessment', 'start', 'new test', 'check in'],
      response: 'You can begin a fresh assessment from the "New Assessment" tab on your dashboard. It walks through emotion analysis, 10 smart questions, optional wellness activities, and post-comparison.'
    },
    {
      keywords: ['activity', 'wellness', 'breathing', 'mindfulness'],
      response: 'After you review results, select "Try Wellness Activities". Each activity is live-monitored for engagement and feeds back into your improvement score.'
    },
    {
      keywords: ['result', 'report', 'score', 'improvement'],
      response: 'Your full report (radar chart, key findings, improvement trend) is always available under the profile tab. Post-activity scores show exactly how much you improved.'
    },
    {
      keywords: ['dashboard', 'overview', 'cards', 'stats'],
      response: 'The dashboard highlights total assessments, latest risk level, and privacy status. Use the tabs along the top to jump between assessments, chat, profile, and reviews.'
    },
    {
      keywords: ['profile', 'history', 'past'],
      response: 'Open the “My Profile” tab to review your personal information, recent assessments, and improvement timeline.'
    },
    {
      keywords: ['admin', 'support', 'customer care'],
      response: 'Admins review escalated chats from their dashboard every few minutes. If your message requires a human response you will see a follow-up inside this thread.'
    },
    {
      keywords: ['system control', 'live monitoring', 'settings'],
      response: 'Administrators can adjust accuracy thresholds, live monitoring, and system metrics from the admin console. Users automatically benefit from these safeguards.'
    },
    {
      keywords: ['resource', 'help', 'emergency'],
      response: 'Emergency contacts sit on the right panel: call 988 for the National Suicide Prevention Lifeline or text HOME to 741741 for the Crisis Text Line—both 24/7.'
    },
    {
      keywords: ['privacy', 'data', 'storage'],
      response: 'All assessments are stored locally on your device; you can clear them anytime. Only you and designated admins can see support replies.'
    }
  ];

  const getSmartResponse = (text: string) => {
    const lower = text.toLowerCase();
    const knowledgeHit = knowledgeBase.find(rule => rule.keywords.some(keyword => lower.includes(keyword)));
    if (knowledgeHit) return knowledgeHit.response;

    if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('panic') || lower.includes('stress')) {
      return "I hear how overwhelming that anxiety can feel. Try a few grounding breaths—in for four counts, hold for four, out for six—and remember you're not alone in this.";
    }
    if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('tired')) {
      return 'Improving sleep can start with small habits: dim lights an hour before bed, avoid screens, and keep a consistent routine.';
    }
    if (lower.includes('sad') || lower.includes('depressed') || lower.includes('lonely')) {
      return "I'm sorry you're feeling this way. Reaching out to someone you trust or writing about what you feel can help, and I’m here to listen.";
    }
    if (lower.includes('angry') || lower.includes('frustrated')) {
      return 'Strong emotions can drain energy. A quick release exercise—clench your fists for five seconds, then release—may help reset your body. Want more coping ideas?';
    }
    return null;
  };

  const suggestedQuestions = [
    'How do I start a new assessment?',
    'What do the wellness activities do?',
    'Where can I see my previous results?',
    'Who can view my chat messages?',
    'What emergency contacts are available?'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    
    const savedMessage = submitChatMessage({
      userId: currentUserId,
      message: message.trim(),
      anonymous,
      sender: 'user'
    });

    setMessage('');
    setLoading(false);

    const aiResponse = getSmartResponse(message.trim());
    setTimeout(() => {
      if (aiResponse) {
        submitChatMessage({
          userId: currentUserId,
          message: aiResponse,
          anonymous: true,
          response: 'ai',
          sender: 'support'
        });
        if (savedMessage) {
          markChatMessageHandled(savedMessage.id, 'ai');
        }
      } else {
        submitChatMessage({
          userId: currentUserId,
          message: "I'm forwarding your message to a support specialist who can provide a personalized reply shortly.",
          anonymous: true,
          response: 'system',
          sender: 'support'
        });
      }
    }, 1200);
  };

  return (
    <Box sx={{ px: { xs: 0, sm: 1 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
        Anonymous Chat Support
      </Typography>
      
      <Alert severity="info" sx={{ mb: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          <strong>24/7 Support Available:</strong> Our trained counselors are here to help. 
          If you're experiencing a mental health crisis, please contact emergency services 
          immediately or call the National Suicide Prevention Lifeline: 988
        </Typography>
      </Alert>

      <Box
        sx={{
          display: 'flex',
          gap: { xs: 2, sm: 3 },
          alignItems: 'stretch',
          minHeight: { xs: 400, sm: 480 },
          flexDirection: { xs: 'column', lg: 'row' }
        }}
      >
        {/* Chat Messages */}
        <Paper
          ref={chatPanelRef}
          sx={{ 
            flex: 1, 
            p: { xs: 1.5, sm: 2 }, 
            display: 'flex', 
            flexDirection: 'column', 
            maxWidth: '100%',
            borderRadius: 3,
            boxShadow: 3
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, mb: 0 }}>
              Support Messages
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={clearConversation}
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Clear
            </Button>
          </Box>
          
          <Box ref={messagesRef} sx={{ flex: 1, overflow: 'auto', mb: 2, pr: 1, display: 'flex', flexDirection: 'column' }}>
            {userMessages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Support sx={{ fontSize: 48, mb: 2 }} />
                <Typography>No messages yet. Start a conversation!</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                {userMessages.map((msg, idx) => {
                  const sender = msg.sender || (msg.response ? 'support' : 'user');
                  const isUser = sender === 'user';
                  return (
                    <Box key={msg.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {!isUser && (
                          <Avatar sx={{ bgcolor: msg.response ? 'secondary.main' : 'primary.main' }}>
                            {msg.response === 'admin' ? <Person /> : <SmartToy />}
                          </Avatar>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {isUser ? (msg.anonymous ? 'Anonymous User' : userDisplayName) : 'Support Team'}
                          <Chip label={new Date(msg.timestamp).toLocaleTimeString()} size="small" sx={{ ml: 1 }} />
                        </Typography>
                        {isUser && (
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Person />
                          </Avatar>
                        )}
                      </Box>
                      <Box
                        sx={{
                          maxWidth: { xs: '100%', md: '70%' },
                          width: 'fit-content',
                          display: 'inline-block'
                        }}
                      >
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
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Suggested questions
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestedQuestions.map((suggestion) => (
                <Chip
                  key={suggestion}
                  label={suggestion}
                  variant="outlined"
                  onClick={() => setMessage(suggestion)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </Paper>

        {/* Support Resources */}
        <Paper
          sx={{
            width: { xs: '100%', md: 340 },
            p: 2,
            flexShrink: 0,
            alignSelf: { xs: 'auto', lg: 'stretch' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: {
              xs: 'auto',
              lg: chatPanelHeight ? `${chatPanelHeight}px` : 'auto'
            },
            maxHeight: {
              xs: 'none',
              lg: chatPanelHeight ? `${chatPanelHeight}px` : 'none'
            },
            transition: 'height 0.3s ease'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Crisis Resources
          </Typography>
          
          <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
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
            
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Self-Care Tips
            </Typography>
            
            <Card sx={{ p: 2, bgcolor: '#f8f9fa', mb: 2 }}>
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
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatSupport;