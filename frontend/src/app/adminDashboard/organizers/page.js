"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  IconButton,
  Fade,
  Container,
  useTheme,
  alpha,
  Stack,
  Divider,
  Badge,
  Paper
} from "@mui/material";
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Event as EventIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  Groups as GroupsIcon
} from "@mui/icons-material";
import axios from "../../utils/axiosInstance";

const OrganizersPage = () => {
  const theme = useTheme();
  const token = localStorage.getItem("token");
  const [organizers, setOrganizers] = useState([]);
  const [filteredOrganizers, setFilteredOrganizers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const res = await axios.get("/api/admin/users/organizers", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrganizers(res.data);
        setFilteredOrganizers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching organizers:", err);
        setLoading(false);
      }
    };

    fetchOrganizers();
  }, [token]);

  useEffect(() => {
    const filtered = organizers.filter(organizer =>
      organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      organizer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrganizers(filtered);
  }, [searchTerm, organizers]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #1976d2, #1565c0)',
      'linear-gradient(135deg, #2196f3, #1976d2)',
      'linear-gradient(135deg, #0d47a1, #1976d2)',
      'linear-gradient(135deg, #1565c0, #0d47a1)',
      'linear-gradient(135deg, #42a5f5, #1976d2)',
      'linear-gradient(135deg, #1976d2, #42a5f5)'
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '4px solid #e3f2fd',
                borderTop: '4px solid #1976d2',
                animation: 'spin 1s linear infinite',
                mx: 'auto',
                mb: 2,
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }}
            />
            <Typography variant="h6" color="text.secondary">Loading organizers...</Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e8f5e8 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Animated Header Section */}
        <Box mb={4}>
          <Fade in timeout={800}>
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(45deg, #1976d2, #2196f3, #42a5f5)',
                  backgroundSize: '200% 200%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradientShift 3s ease infinite',
                  mb: 1,
                  '@keyframes gradientShift': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' }
                  }
                }}
              >
                Event Organizers Hub
              </Typography>
              <Typography variant="h6" color="text.secondary" mb={4}>
                Manage and coordinate with all event organizers seamlessly
              </Typography>
            </Box>
          </Fade>
          
          {/* Enhanced Stats Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Fade in timeout={1000}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                    color: 'white',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 100,
                      height: 100,
                      background: alpha('#fff', 0.1),
                      borderRadius: '50%'
                    }
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ 
                        bgcolor: alpha('#fff', 0.2), 
                        width: 56, 
                        height: 56,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }}>
                        <GroupsIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h3" fontWeight="bold">
                          {organizers.length}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Total Organizers
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Fade in timeout={1200}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                    color: 'white',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 100,
                      height: 100,
                      background: alpha('#fff', 0.1),
                      borderRadius: '50%'
                    }
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ 
                        bgcolor: alpha('#fff', 0.2),
                        width: 56, 
                        height: 56,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }}>
                        <EventIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h3" fontWeight="bold">
                          {organizers.filter(o => o.status !== 'inactive').length || organizers.length}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Active Organizers
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Fade in timeout={1400}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #42a5f5, #1976d2)',
                    color: 'white',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 100,
                      height: 100,
                      background: alpha('#fff', 0.1),
                      borderRadius: '50%'
                    }
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ 
                        bgcolor: alpha('#fff', 0.2),
                        width: 56, 
                        height: 56,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }}>
                        <TrendingUpIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h3" fontWeight="bold">
                          {Math.round((organizers.filter(o => o.status !== 'inactive').length / organizers.length) * 100) || 100}%
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Success Rate
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>

          {/* Enhanced Search Bar */}
          <Fade in timeout={1600}>
            <Paper
              elevation={0}
              sx={{
                p: 1,
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(25, 118, 210, 0.1)'
              }}
            >
              <TextField
                fullWidth
                placeholder="Search organizers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#1976d2' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    border: 'none',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                    background: 'transparent'
                  },
                }}
              />
            </Paper>
          </Fade>
        </Box>

        {/* Enhanced Organizers Grid */}
        <Grid container spacing={3}>
          {filteredOrganizers.map((organizer, index) => (
            <Grid item xs={12} sm={6} lg={4} key={organizer._id}>
              <Fade in timeout={300 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    cursor: 'pointer',
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 25px 50px rgba(25, 118, 210, 0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: getRandomGradient(index),
                      zIndex: 1
                    }
                  }}
                >
                  {/* Enhanced Card Header */}
                  <Box
                    sx={{
                      background: getRandomGradient(index),
                      p: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -30,
                        right: -30,
                        width: 120,
                        height: 120,
                        background: alpha('#fff', 0.1),
                        borderRadius: '50%',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -20,
                        left: -20,
                        width: 80,
                        height: 80,
                        background: alpha('#fff', 0.05),
                        borderRadius: '50%',
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ position: 'relative', zIndex: 2 }}>
                      <Badge
                        badgeContent=""
                        color={organizer.status === 'inactive' ? 'error' : 'success'}
                        variant="dot"
                        sx={{
                          '& .MuiBadge-badge': {
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            border: '2px solid white'
                          }
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: alpha('#fff', 0.2),
                            color: 'white',
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            border: '3px solid rgba(255,255,255,0.3)'
                          }}
                        >
                          {getInitials(organizer.name)}
                        </Avatar>
                      </Badge>
                      <Box sx={{ color: 'white', flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" noWrap sx={{ mb: 0.5 }}>
                          {organizer.name}
                        </Typography>
                        <Chip
                          label={organizer.status || 'Active'}
                          size="small"
                          sx={{
                            bgcolor: alpha('#fff', 0.25),
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'capitalize',
                            border: '1px solid rgba(255,255,255,0.3)'
                          }}
                        />
                      </Box>
                      <IconButton 
                        sx={{ 
                          color: alpha('#fff', 0.8),
                          '&:hover': { 
                            bgcolor: alpha('#fff', 0.1),
                            transform: 'rotate(90deg)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Stack>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      {/* Email Section */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: alpha('#1976d2', 0.05),
                          border: `1px solid ${alpha('#1976d2', 0.1)}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: alpha('#1976d2', 0.08),
                            transform: 'translateX(4px)'
                          }
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ 
                            width: 40, 
                            height: 40, 
                            bgcolor: alpha('#1976d2', 0.1),
                            border: `2px solid ${alpha('#1976d2', 0.2)}`
                          }}>
                            <EmailIcon sx={{ fontSize: 20, color: '#1976d2' }} />
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="caption" color="text.secondary" fontSize="0.7rem" fontWeight="bold">
                              EMAIL ADDRESS
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" noWrap sx={{ mt: 0.5 }}>
                              {organizer.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      <Divider sx={{ opacity: 0.3 }} />

                      {/* Additional Info Grid */}
                      <Grid container spacing={2}>
                        {organizer.phone && (
                          <Grid item xs={12}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: alpha('#2196f3', 0.1) 
                              }}>
                                <PhoneIcon sx={{ fontSize: 16, color: '#2196f3' }} />
                              </Avatar>
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                                  PHONE
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {organizer.phone}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                        )}
                        
                        {organizer.location && (
                          <Grid item xs={12}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: alpha('#42a5f5', 0.1) 
                              }}>
                                <LocationIcon sx={{ fontSize: 16, color: '#42a5f5' }} />
                              </Avatar>
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                                  LOCATION
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {organizer.location}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                        )}
                        
                        <Grid item xs={12}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: alpha('#1565c0', 0.1) 
                            }}>
                              <CalendarIcon sx={{ fontSize: 16, color: '#1565c0' }} />
                            </Avatar>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                                JOINED
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {organizer.createdAt ? new Date(organizer.createdAt).toLocaleDateString() : 'Recently'}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>

                      {/* Action Buttons */}
                      <Stack direction="row" spacing={1} pt={1}>
                        <Chip
                          label="View Events"
                          size="small"
                          sx={{
                            bgcolor: alpha('#1976d2', 0.1),
                            color: '#1976d2',
                            fontWeight: 'bold',
                            '&:hover': {
                              bgcolor: alpha('#1976d2', 0.2),
                              transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        />
                        <Chip
                          label="Contact"
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: alpha('#1976d2', 0.3),
                            color: '#1976d2',
                            fontWeight: 'bold',
                            '&:hover': {
                              borderColor: '#1976d2',
                              bgcolor: alpha('#1976d2', 0.05),
                              transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* No Results */}
        {filteredOrganizers.length === 0 && (
          <Fade in timeout={1800}>
            <Box textAlign="center" py={8}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: alpha('#1976d2', 0.1),
                  mx: 'auto',
                  mb: 3
                }}
              >
                <GroupsIcon sx={{ fontSize: 40, color: '#1976d2' }} />
              </Avatar>
              <Typography variant="h5" color="text.secondary" mb={2} fontWeight="medium">
                No organizers found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {searchTerm ? 'Try adjusting your search terms' : 'No event organizers have been registered yet'}
              </Typography>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default OrganizersPage;