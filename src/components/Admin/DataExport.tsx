import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import {
  Download,
  TableChart,
  Security,
  DateRange,
  Assessment,
  Psychology,
  CheckCircle
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

interface DataExportProps {
  assessments: Assessment[];
}

const DataExport: React.FC<DataExportProps> = ({ assessments }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [includePersonalData, setIncludePersonalData] = useState(false);
  const [includeResponses, setIncludeResponses] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [dateRange, setDateRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const generateCSV = (data: any[], headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    return csvContent;
  };

  const generateJSON = (data: any[]) => {
    return JSON.stringify(data, null, 2);
  };

  const anonymizeData = (data: Assessment[]) => {
    return data.map(assessment => ({
      ...assessment,
      userId: includePersonalData ? assessment.userId : `user_${assessment.userId.slice(-4)}`,
      id: `assessment_${assessment.id.slice(-6)}`
    }));
  };

  const filterDataByDateRange = (data: Assessment[]) => {
    const now = new Date();
    
    switch (dateRange) {
      case 'today':
        return data.filter(a => new Date(a.timestamp).toDateString() === now.toDateString());
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return data.filter(a => new Date(a.timestamp) >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return data.filter(a => new Date(a.timestamp) >= monthAgo);
      default:
        return data;
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      const filteredData = filterDataByDateRange(assessments);
      const anonymizedData = anonymizeData(filteredData);
      
      const exportData = anonymizedData.map(assessment => ({
        id: assessment.id,
        userId: assessment.userId,
        riskLevel: assessment.riskLevel,
        riskScore: assessment.riskScore,
        emotionType: assessment.emotionType,
        timestamp: assessment.timestamp,
        ...(includeResponses && { responses: JSON.stringify(assessment.responses) }),
        ...(includeRecommendations && { recommendations: assessment.recommendations.join('; ') })
      }));

      let content: string;
      let filename: string;
      let mimeType: string;

      if (exportFormat === 'csv') {
        const headers = Object.keys(exportData[0] || {});
        content = generateCSV(exportData, headers);
        filename = `mental_health_assessments_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        content = generateJSON(exportData);
        filename = `mental_health_assessments_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
    }, 1000);
  };

  const getExportStats = () => {
    const filteredData = filterDataByDateRange(assessments);
    const riskCounts = filteredData.reduce((acc, assessment) => {
      acc[assessment.riskLevel] = (acc[assessment.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: filteredData.length,
      ...riskCounts
    };
  };

  const stats = getExportStats();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Data Export
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Privacy Notice:</strong> Exported data follows HIPAA compliance guidelines. 
          Personal identifiers are anonymized by default. Use exported data responsibly 
          and ensure proper security measures are in place.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Export Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Export Configuration
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Export Format</InputLabel>
                  <Select
                    value={exportFormat}
                    label="Export Format"
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <MenuItem value="csv">CSV (Comma Separated Values)</MenuItem>
                    <MenuItem value="json">JSON (JavaScript Object Notation)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={dateRange}
                    label="Date Range"
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="week">This Week</MenuItem>
                    <MenuItem value="month">This Month</MenuItem>
                  </Select>
                </FormControl>

                <Divider />

                <Typography variant="subtitle1" gutterBottom>
                  Data Fields
                </Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includePersonalData}
                      onChange={(e) => setIncludePersonalData(e.target.checked)}
                    />
                  }
                  label="Include Personal Identifiers (Not Recommended)"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeResponses}
                      onChange={(e) => setIncludeResponses(e.target.checked)}
                    />
                  }
                  label="Include Question Responses"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeRecommendations}
                      onChange={(e) => setIncludeRecommendations(e.target.checked)}
                    />
                  }
                  label="Include Recommendations"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Export Preview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Export Preview
              </Typography>

              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Export Statistics
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Assessment />
                    </ListItemIcon>
                    <ListItemText
                      primary="Total Assessments"
                      secondary={stats.total}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: 'success.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Low Risk"
                      secondary={stats.low || 0}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Moderate Risk"
                      secondary={stats.moderate || 0}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: 'error.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="High Risk"
                      secondary={stats.high || 0}
                    />
                  </ListItem>
                </List>
              </Paper>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  File Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <TableChart />
                    </ListItemIcon>
                    <ListItemText
                      primary="Format"
                      secondary={exportFormat.toUpperCase()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DateRange />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date Range"
                      secondary={dateRange === 'all' ? 'All Time' : dateRange}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="Privacy"
                      secondary={includePersonalData ? 'Personal Data Included' : 'Anonymized'}
                    />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Export Button */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleExport}
              disabled={isExporting || stats.total === 0}
              startIcon={<Download />}
              sx={{ minWidth: 200 }}
            >
              {isExporting ? 'Exporting...' : `Export ${stats.total} Records`}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataExport;