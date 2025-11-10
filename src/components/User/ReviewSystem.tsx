import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Rating,
  Alert,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Star,
  Send,
  CheckCircle,
  Person,
  Verified,
  RateReview,
  ThumbUp,
  Comment
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const ReviewSystem: React.FC = () => {
  const { user } = useAuth();
  const { submitReview, getReviews } = useData();
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');
  const [userRole, setUserRole] = useState('');
  const [category, setCategory] = useState('overall');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const reviews = getReviews().slice(0, 8); // Show recent reviews

  const categories = [
    { value: 'overall', label: 'Overall Experience' },
    { value: 'accuracy', label: 'AI Accuracy' },
    { value: 'interface', label: 'User Interface' },
    { value: 'support', label: 'Customer Support' },
    { value: 'features', label: 'Features & Functionality' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim() || !userRole.trim()) {
      return;
    }

    setLoading(true);
    
    try {
      await submitReview({
        userName: user?.name || 'Anonymous User',
        userRole: userRole.trim(),
        rating,
        comment: comment.trim(),
        category,
        featured: false,
        verified: true
      });
      
      setSubmitted(true);
      setRating(0);
      setComment('');
      setUserRole('');
      setCategory('overall');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CheckCircle sx={{ fontSize: 100, color: 'success.main', mb: 3 }} />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'success.main' }}>
          🎉 Thank You for Your Review!
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Your feedback is invaluable! It helps us improve our AI healthcare system and assists other users in making informed decisions about their mental health journey.
        </Typography>
        
        <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto', mb: 4, bgcolor: '#f8f9fa' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            ✨ What happens next?
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="📝 Review Processing"
                secondary="Our team will review your feedback within 24 hours"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="🌟 Featured Reviews"
                secondary="High-quality reviews may be featured on our homepage"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="🔄 Continuous Improvement"
                secondary="Your insights help us enhance our AI algorithms and user experience"
              />
            </ListItem>
          </List>
        </Paper>
        
        <Button
          variant="contained"
          onClick={() => setSubmitted(false)}
          size="large"
          sx={{ minWidth: 200, py: 2 }}
        >
          Submit Another Review
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
        ⭐ Rate & Review Our AI Healthcare System
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Share your experience to help others and improve our platform
      </Typography>
      
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body1">
          <strong>🤝 Help Our Community:</strong> Your honest review helps improve our AI healthcare system and assists other users in understanding the benefits of our platform. Quality reviews may be featured on our homepage to guide new users.
        </Typography>
      </Alert>

      <Grid container spacing={4}>
        {/* Review Submission Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
              <RateReview color="primary" />
              Share Your Experience
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              {/* Rating Section */}
              <Paper sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa', border: '2px solid #e3f2fd' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  ⭐ Overall Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                  <Rating
                    name="rating"
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                    size="large"
                    precision={1}
                    sx={{ fontSize: '3rem' }}
                  />
                  <Box>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                      {rating ? `${rating} out of 5 stars` : 'Select a rating'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rating === 5 ? '🌟 Excellent!' :
                       rating === 4 ? '👍 Very Good' :
                       rating === 3 ? '👌 Good' :
                       rating === 2 ? '👎 Fair' :
                       rating === 1 ? '😞 Poor' : 'Rate your experience'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* User Details */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Your Role/Profession"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    placeholder="e.g., Healthcare Professional, Student, Researcher, Patient"
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Review Category</InputLabel>
                    <Select
                      value={category}
                      label="Review Category"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Review Text */}
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Your Detailed Review"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with our AI healthcare system. How has it helped you? What features do you find most valuable? Any suggestions for improvement? Be specific and honest - your insights help others make informed decisions."
                sx={{ mb: 4 }}
                required
                variant="outlined"
              />

              {/* Submit Button */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!rating || !comment.trim() || !userRole.trim() || loading}
                  startIcon={<Send />}
                  sx={{ 
                    minWidth: 200,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  {loading ? 'Submitting Review...' : '🚀 Submit Review'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    setRating(0);
                    setComment('');
                    setUserRole('');
                    setCategory('overall');
                  }}
                  sx={{ py: 2 }}
                >
                  Clear Form
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Recent Reviews Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                <Star sx={{ color: '#ffc107' }} />
                Recent Community Reviews
              </Typography>
              
              <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                <List>
                  {reviews.map((review, index) => (
                    <React.Fragment key={review.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
                            {review.userName.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {review.userName}
                                </Typography>
                                {review.featured && <Verified sx={{ color: 'primary.main', fontSize: 18 }} />}
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {review.userRole}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Rating value={review.rating} size="small" readOnly />
                                <Typography variant="body2" color="text.secondary">
                                  ({review.rating}/5)
                                </Typography>
                                {review.category && (
                                  <Chip 
                                    label={review.category} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ textTransform: 'capitalize' }}
                                  />
                                )}
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ 
                                display: '-webkit-box',
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mb: 1,
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word'
                              }}>
                                "{review.comment}"
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(review.timestamp).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < reviews.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>

              {reviews.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <Person sx={{ fontSize: 48, mb: 2 }} />
                  <Typography>No reviews yet. Be the first to share your experience!</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Review Guidelines */}
          <Paper sx={{ p: 3, mt: 3, bgcolor: '#f8f9fa' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Comment color="primary" />
              Review Guidelines
            </Typography>
            <List dense>
              <ListItem sx={{ px: 0 }}>
                <Typography variant="body2">
                  ✅ Be honest and constructive in your feedback
                </Typography>
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <Typography variant="body2">
                  🎯 Focus on your experience with the system
                </Typography>
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <Typography variant="body2">
                  🔒 Avoid sharing personal health information
                </Typography>
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <Typography variant="body2">
                  🤝 Help others understand the system's benefits
                </Typography>
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <Typography variant="body2">
                  💡 Suggest improvements for future updates
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewSystem;