"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Button,
  Container,
  Chip,
  Avatar,
  Fade,
  IconButton,
  Divider,
  Paper,
  Grid,
  Skeleton
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Restaurant,
  AttachMoney,
  Person,
  Inventory,
  Schedule
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "../../utils/axiosInstance";

// Beautiful Blue Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#0d47a1',
    },
    background: {
      default: '#f8faff',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(25, 118, 210, 0.2)',
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        }
      }
    }
  }
});

const ApprovalsPage = () => {
  const token = localStorage.getItem("token");
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admin/products/pending", headers);
        setPendingProducts(res.data);
      } catch (err) {
        console.error("Error fetching pending products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    setProcessingIds(prev => new Set(prev).add(id));
    
    try {
      await axios.patch(`/api/admin/products/${id}/${action}`, {}, headers);
      setPendingProducts(prev => prev.filter(product => product._id !== id));
    } catch (err) {
      console.error(`Failed to ${action} product`, err);
      alert("Something went wrong");
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const LoadingSkeleton = () => (
    <Stack spacing={3}>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Skeleton variant="rectangular" width={140} height={140} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="50%" height={20} />
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={1}>
                <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 3 }} />
                <Skeleton variant="rectangular" width={80} height={40} sx={{ borderRadius: 3 }} />
              </Stack>
            </Grid>
          </Grid>
        </Card>
      ))}
    </Stack>
  );

  const EmptyState = () => (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f8faff 100%)',
        borderRadius: 3,
        border: '2px dashed #90caf9'
      }}
    >
      <Inventory sx={{ fontSize: 64, color: 'primary.light', mb: 2 }} />
      <Typography variant="h5" color="primary.main" fontWeight={600} mb={1}>
        All Clear! 🎉
      </Typography>
      <Typography variant="body1" color="text.secondary">
        No pending products to review at the moment.
      </Typography>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f8faff 50%, #ffffff 100%)',
          py: 4
        }}
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
              color: 'white',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              }}
            />
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  width: 56,
                  height: 56
                }}
              >
                <Schedule sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700} mb={1}>
                  Product Approvals
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Review and manage pending product submissions
                </Typography>
              </Box>
            </Stack>
            
            {!loading && (
              <Chip
                label={`${pendingProducts.length} Pending`}
                sx={{
                  position: 'absolute',
                  top: 24,
                  right: 24,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              />
            )}
          </Paper>

          {/* Content Section */}
          {loading ? (
            <LoadingSkeleton />
          ) : pendingProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <Stack spacing={3}>
              {pendingProducts.map((product, index) => (
                <Fade in timeout={300 + index * 100} key={product._id}>
                  <Card
                    sx={{
                      overflow: 'visible',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: 'linear-gradient(90deg, #1976d2, #2196f3)',
                        borderRadius: '16px 16px 0 0'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={3} alignItems="center">
                        {/* Product Image */}
                        <Grid item>
                          <Box
                            sx={{
                              position: 'relative',
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={`http://localhost:5000/${product.image}`}
                              alt={product.name}
                              sx={{
                                width: 140,
                                height: 140,
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)'
                                }
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: '50%',
                                width: 32,
                                height: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Restaurant sx={{ fontSize: 16 }} />
                            </Box>
                          </Box>
                        </Grid>

                        {/* Product Details */}
                        <Grid item xs>
                          <Stack spacing={2}>
                            <Box>
                              <Typography
                                variant="h5"
                                fontWeight={700}
                                color="primary.main"
                                mb={1}
                              >
                                {product.name}
                              </Typography>
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  lineHeight: 1.5
                                }}
                              >
                                {product.description}
                              </Typography>
                            </Box>

                            <Stack direction="row" spacing={2} alignItems="center">
                              <Chip
                                icon={<AttachMoney />}
                                label={`₹${product.price}`}
                                color="primary"
                                variant="filled"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '1rem',
                                  '& .MuiChip-icon': {
                                    fontSize: 18
                                  }
                                }}
                              />
                              
                              <Divider orientation="vertical" flexItem />
                              
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Person sx={{ color: 'text.secondary', fontSize: 20 }} />
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                  {product.vendorEmail}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Grid>

                        {/* Action Buttons */}
                        <Grid item>
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => handleAction(product._id, "approved")}
                              disabled={processingIds.has(product._id)}
                              sx={{
                                minWidth: 120,
                                background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 8px 24px rgba(76, 175, 80, 0.4)'
                                }
                              }}
                            >
                              Approve
                            </Button>
                            
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<Cancel />}
                              onClick={() => handleAction(product._id, "rejected")}
                              disabled={processingIds.has(product._id)}
                              sx={{
                                minWidth: 100,
                                borderWidth: 2,
                                '&:hover': {
                                  borderWidth: 2,
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 8px 24px rgba(244, 67, 54, 0.3)'
                                }
                              }}
                            >
                              Reject
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ApprovalsPage;