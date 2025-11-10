import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Alert,
  Chip
} from '@mui/material';
import {
  Timer,
  CheckCircle,
  SelfImprovement,
  PlayArrow,
  Stop,
  Psychology,
  Refresh
} from '@mui/icons-material';
import { wellnessActivities } from '../../data/questionBank';

interface WellnessActivityProps {
  onComplete: (activityResults: {
    completed: string[];
    duration: number;
    improvement: number;
  }) => void;
}

const WellnessActivity: React.FC<WellnessActivityProps> = ({ onComplete }) => {
  const [selectedActivity, setSelectedActivity] = useState<typeof wellnessActivities[0] | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          const newTime = time - 1;
          setProgress(((selectedActivity?.duration || 120) - newTime) / (selectedActivity?.duration || 120) * 100);
          return newTime;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleActivityComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startActivity = (activity: typeof wellnessActivities[0]) => {
    setSelectedActivity(activity);
    setTimeLeft(activity.duration);
    setIsActive(true);
    setShowDialog(true);
  };

  const stopActivity = () => {
    setIsActive(false);
    setShowDialog(false);
    setProgress(0);
  };

  const handleActivityComplete = () => {
    if (!selectedActivity) return;
    
    setIsActive(false);
    setShowDialog(false);
    setProgress(0);
    setCompletedActivities(prev => [...prev, selectedActivity.id]);
    setTotalDuration(prev => prev + (selectedActivity?.duration || 0));
    
    if (completedActivities.length + 1 >= 2) {
      // Complete the whole wellness session after 2 activities
      onComplete({
        completed: [...completedActivities, selectedActivity.id],
        duration: totalDuration + (selectedActivity?.duration || 0),
        improvement: Math.random() * 0.3 + 0.1 // Simulate 10-40% improvement
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <SelfImprovement color="primary" sx={{ fontSize: 32 }} />
        Wellness Activities
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Complete at least two activities to help improve your mental state. Each activity takes 1-2 minutes.
      </Alert>

      <Grid container spacing={3}>
        {wellnessActivities.map(activity => (
          <Grid item xs={12} md={6} key={activity.id}>
            <Card 
              sx={{ 
                height: '100%',
                opacity: completedActivities.includes(activity.id) ? 0.7 : 1,
                transform: completedActivities.includes(activity.id) ? 'none' : 'scale(1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: completedActivities.includes(activity.id) ? 'none' : 'scale(1.02)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    {activity.name}
                  </Typography>
                  <Chip 
                    icon={<Timer />}
                    label={`${activity.duration / 60} min`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <List dense>
                  {activity.benefits.map((benefit, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => startActivity(activity)}
                    disabled={completedActivities.includes(activity.id)}
                    startIcon={completedActivities.includes(activity.id) ? <CheckCircle /> : <PlayArrow />}
                  >
                    {completedActivities.includes(activity.id) ? 'Completed' : 'Start Activity'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={showDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Psychology color="primary" />
            {selectedActivity?.name}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ textAlign: 'center', my: 3 }}>
            <CircularProgress 
              variant="determinate" 
              value={progress}
              size={120}
              thickness={4}
              sx={{
                circle: {
                  strokeLinecap: 'round',
                }
              }}
            />
            <Box sx={{ 
              position: 'absolute', 
              left: '50%', 
              top: '50%', 
              transform: 'translate(-50%, -50%)'
            }}>
              <Typography variant="h4">
                {Math.ceil(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </Typography>
            </Box>
          </Box>

          <List>
            {selectedActivity?.instructions.map((instruction, index) => (
              <Fade in key={index} timeout={500 * (index + 1)}>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={instruction} />
                </ListItem>
              </Fade>
            ))}
          </List>

          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              mt: 2,
              bgcolor: 'rgba(0,0,0,0.1)'
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleActivityComplete}
            variant="outlined"
            startIcon={<Stop />}
          >
            End Early
          </Button>
          {timeLeft === 0 && (
            <Button
              onClick={handleActivityComplete}
              variant="contained"
              startIcon={<CheckCircle />}
              color="success"
            >
              Complete Activity
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {completedActivities.length > 0 && completedActivities.length < 2 && (
        <Paper sx={{ mt: 3, p: 3, bgcolor: 'primary.light', color: 'white' }}>
          <Typography variant="h6" gutterBottom>
            Progress Update
          </Typography>
          <Typography variant="body1">
            {2 - completedActivities.length} more {2 - completedActivities.length === 1 ? 'activity' : 'activities'} needed for improvement assessment
          </Typography>
          <LinearProgress 
            variant="determinate"
            value={completedActivities.length * 50}
            sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)' }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default WellnessActivity;