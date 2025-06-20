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
  Badge
} from "@mui/material";
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Store as StoreIcon,
  MoreVert as MoreVertIcon
} from "@mui/icons-material";
import axios from "../../utils/axiosInstance";

const VendorsPage = () => {
  const theme = useTheme();
  const token = localStorage.getItem("token");
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get("/api/admin/users/vendors", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVendors(res.data);
        setFilteredVendors(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    const filtered = vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendors(filtered);
  }, [searchTerm, vendors]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomColor = (index) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      '#1976d2',
      '#1565c0',
      '#0d47a1',
      '#2196f3'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6" color="text.secondary">Loading vendors...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha('#1976d2', 0.1)} 0%, ${alpha('#2196f3', 0.05)} 100%)`,
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box mb={4}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Vendor Management
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={3}>
            Manage and monitor all registered food vendors
          </Typography>
          
          {/* Stats Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: alpha('#fff', 0.2) }}>
                      <StoreIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {vendors.length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Vendors
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: alpha('#fff', 0.2) }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {vendors.filter(v => v.status !== 'inactive').length || vendors.length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Active Vendors
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search vendors by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: 3,
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
            }}
          />
        </Box>

        {/* Vendors Grid */}
        <Grid container spacing={3}>
          {filteredVendors.map((vendor, index) => (
            <Grid item xs={12} sm={6} lg={4} key={vendor._id}>
              <Fade in timeout={300 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    borderRadius: 3,
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  }}
                >
                  {/* Card Header with gradient */}
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${getRandomColor(index)}, ${alpha(getRandomColor(index), 0.8)})`,
                      p: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 100,
                        height: 100,
                        background: alpha('#fff', 0.1),
                        borderRadius: '50%',
                        transform: 'translate(30px, -30px)',
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Badge
                        badgeContent={vendor.status === 'active' ? '●' : '○'}
                        color={vendor.status === 'active' ? 'success' : 'default'}
                        sx={{
                          '& .MuiBadge-badge': {
                            right: -2,
                            top: 2,
                          }
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            bgcolor: alpha('#fff', 0.2),
                            color: 'white',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {getInitials(vendor.name)}
                        </Avatar>
                      </Badge>
                      <Box sx={{ color: 'white', flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {vendor.name}
                        </Typography>
                        <Chip
                          label={vendor.status || 'Active'}
                          size="small"
                          sx={{
                            bgcolor: alpha('#fff', 0.2),
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'capitalize'
                          }}
                        />
                      </Box>
                      <IconButton sx={{ color: alpha('#fff', 0.8) }}>
                        <MoreVertIcon />
                      </IconButton>
                    </Stack>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      {/* Email */}
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: alpha(theme.palette.primary.main, 0.1) 
                        }}>
                          <EmailIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                            EMAIL
                          </Typography>
                          <Typography variant="body2" fontWeight="medium" noWrap>
                            {vendor.email}
                          </Typography>
                        </Box>
                      </Stack>

                      <Divider sx={{ opacity: 0.3 }} />

                      {/* Additional Info Row */}
                      <Grid container spacing={2}>
                        {vendor.phone && (
                          <Grid item xs={6}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <PhoneIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {vendor.phone}
                              </Typography>
                            </Stack>
                          </Grid>
                        )}
                        {vendor.location && (
                          <Grid item xs={6}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <LocationIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {vendor.location}
                              </Typography>
                            </Stack>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <CalendarIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                            <Typography variant="caption" color="text.secondary">
                              Joined {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'Recently'}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* No Results */}
        {filteredVendors.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              No vendors found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms' : 'No vendors have been registered yet'}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default VendorsPage;