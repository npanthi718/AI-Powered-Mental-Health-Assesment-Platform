import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip
} from '@mui/material';
import {
  Visibility,
  TrendingUp,
  Psychology,
  CalendarToday,
  Email,
  Assessment,
  Close
} from '@mui/icons-material';

interface Assessment {
  id: string;
  userId: string;
  responses: Record<string, number>;
  riskLevel: 'low' | 'moderate' | 'high';
  riskScore: number;
  emotionType: string;
  recommendations: string[];
  timestamp: string;
}

interface UserManagementProps {
  assessments: Assessment[];
}

const UserManagement: React.FC<UserManagementProps> = ({ assessments }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Group assessments by user
  const userStats = assessments.reduce((acc, assessment) => {
    const userId = assessment.userId;
    if (!acc[userId]) {
      acc[userId] = {
        userId,
        totalAssessments: 0,
        averageRiskScore: 0,
        lastAssessment: '',
        riskHistory: [],
        emotionHistory: []
      };
    }
    
    acc[userId].totalAssessments++;
    acc[userId].riskHistory.push(assessment.riskScore);
    acc[userId].emotionHistory.push(assessment.emotionType);
    
    // Update last assessment date
    if (assessment.timestamp > acc[userId].lastAssessment) {
      acc[userId].lastAssessment = assessment.timestamp;
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate average risk scores
  Object.values(userStats).forEach((user: any) => {
    user.averageRiskScore = user.riskHistory.reduce((sum: number, score: number) => sum + score, 0) / user.riskHistory.length;
  });

  const filteredUsers = Object.values(userStats).filter((user: any) =>
    user.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserAssessments = (userId: string) => {
    return assessments.filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getRiskColor = (risk: string | number) => {
    if (typeof risk === 'number') {
      if (risk < 0.35) return 'success';
      if (risk < 0.65) return 'warning';
      return 'error';
    }
    switch (risk) {
      case 'low': return 'success';
      case 'moderate': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score < 0.35) return 'low';
    if (score < 0.65) return 'moderate';
    return 'high';
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'anxious': return '😰';
      case 'neutral': return '😐';
      default: return '😐';
    }
  };

  const handleViewUser = (userId: string) => {
    setSelectedUser(userId);
    setDialogOpen(true);
  };

  const selectedUserAssessments = selectedUser ? getUserAssessments(selectedUser) : [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search Users"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter user ID..."
        />
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            User Overview ({filteredUsers.length} users)
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>Total Assessments</TableCell>
                  <TableCell>Average Risk</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell>Last Assessment</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user: any) => (
                  <TableRow key={user.userId}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          {user.userId.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {user.userId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.totalAssessments}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {(user.averageRiskScore * 100).toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getRiskLevel(user.averageRiskScore)}
                        color={getRiskColor(user.averageRiskScore)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(user.lastAssessment).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          onClick={() => handleViewUser(user.userId)}
                          color="primary"
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              User Details: {selectedUser}
            </Typography>
            <IconButton onClick={() => setDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            {/* User Stats */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  User Statistics
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Assessment />
                    </ListItemIcon>
                    <ListItemText
                      primary="Total Assessments"
                      secondary={selectedUserAssessments.length}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp />
                    </ListItemIcon>
                    <ListItemText
                      primary="Average Risk Score"
                      secondary={`${(selectedUserAssessments.reduce((sum, a) => sum + a.riskScore, 0) / selectedUserAssessments.length * 100).toFixed(1)}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Assessment"
                      secondary={selectedUserAssessments.length > 0 ? new Date(selectedUserAssessments[0].timestamp).toLocaleDateString() : 'No assessments'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Psychology />
                    </ListItemIcon>
                    <ListItemText
                      primary="Most Common Emotion"
                      secondary={selectedUserAssessments.length > 0 ? 
                        Object.entries(
                          selectedUserAssessments
                            .reduce((acc, a) => {
                              acc[a.emotionType] = (acc[a.emotionType] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)
                        ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
                        : 'None'
                      }
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Assessment History */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, mb: 2, maxHeight: 300, overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  Recent Assessments
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Risk</TableCell>
                      <TableCell>Emotion</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedUserAssessments.slice(0, 5).map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(assessment.timestamp).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={assessment.riskLevel}
                            color={getRiskColor(assessment.riskLevel)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{getEmotionIcon(assessment.emotionType)}</span>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                              {assessment.emotionType}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;