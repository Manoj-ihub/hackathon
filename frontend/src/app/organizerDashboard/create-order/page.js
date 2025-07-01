"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
  Paper,
  IconButton,
  Chip,
  Fade,
  Badge,
  AppBar,
  Toolbar,
  Divider,
  InputAdornment,
  Snackbar,
  Alert
} from "@mui/material";
import {
  Add,
  Remove,
  ShoppingCart,
  Restaurant,
  LocalOffer,
  Star,
  Search,
  FilterList
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "../../utils/axiosInstance";

// Blue theme configuration
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
      dark: '#1976d2',
    },
    background: {
      default: '#f8faff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#1565c0',
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(25, 118, 210, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '12px 24px',
          fontWeight: 600,
        },
      },
    },
  },
});

const CreateOrder = () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    // const fetchProducts = async () => {
    //   try {
    //     const res = await axios.get("/api/organizer/products/recent", headers);
    //     setProducts(res.data);
    //   } catch (err) {
    //     console.error("Error loading products:", err);
    //     setSnackbar({ open: true, message: "Failed to load products", severity: "error" });
    //   }
    // };

    // fetchProducts();

      if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(

     async (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
        const res = await axios.get(`/api/organizer/products/recent?latitude=${lat}&longitude=${lon}`, headers);
        setProducts(res.data);
      } catch (err) {
        console.error("Error loading products:", err);
        setSnackbar({ open: true, message: "Failed to load products", severity: "error" });
      }

      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Please allow location access to create a product.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }


  }, []);

  const handleQuantityChange = (id, change) => {
    setQuantities(prev => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + change);
      return {
        ...prev,
        [id]: newQty
      };
    });
  };

  const handleDirectQuantityChange = (id, value) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, Number(value) || 0)
    }));
  };

  const handleSubmit = async () => {
    const orderItems = Object.entries(quantities)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([productId, quantity]) => ({
        productId,
        quantity: Number(quantity)
      }));

    if (orderItems.length === 0) {
      setSnackbar({ open: true, message: "Please add at least one item to your cart", severity: "warning" });
      return;
    }

    try {
      await axios.post("/api/organizer/orders", {
        organizerEmail: email,
        products: orderItems,
        latitude: latitude,
        longitude: longitude,
      }, headers);

      setSnackbar({ open: true, message: "Order placed successfully! 🎉", severity: "success" });
      setQuantities({});
    } catch (err) {
      console.error("Order failed", err);
      setSnackbar({ open: true, message: "Failed to place order. Please try again.", severity: "error" });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + (qty || 0), 0);
  const totalAmount = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const product = products.find(p => p._id === id);
    return sum + (product ? product.price * (qty || 0) : 0);
  }, 0);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        pb: 4
      }}>
        {/* Header */}
        <AppBar position="static" elevation={0} sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          color: 'primary.main'
        }}>
          <Toolbar>
            <Restaurant sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 700 }}>
              FoodieExpress
            </Typography>
            <Badge badgeContent={totalItems} color="secondary">
              <ShoppingCart sx={{ color: 'primary.main' }} />
            </Badge>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {/* Hero Section */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mb: 4, 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ 
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}>
              Delicious Food Awaits
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              Choose from our fresh selection of dishes and create your perfect order
            </Typography>
            
            {/* Search Bar and Place Order Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, maxWidth: 700, mx: 'auto' }}>
              <TextField
                fullWidth
                placeholder="Search for your favorite dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 3,
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.1)',
                  }
                }}
              />
              
              {totalItems > 0 && (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{ 
                    minWidth: 200,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #1976d2, #2196f3)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #1565c0, #1976d2)',
                      transform: 'translateY(-2px)'
                    },
                    fontWeight: 700,
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                  }}
                  startIcon={<ShoppingCart />}
                >
                  Place Order (₹{totalAmount})
                </Button>
              )}
            </Box>
          </Paper>

          {/* Products Grid */}
          <Grid container spacing={3}>
            {filteredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Fade in={true} timeout={300 + index * 100}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Product Image */}
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={`http://localhost:5000/${product.image}`}
                        alt={product.name}
                        sx={{ 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                      <Box sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 2,
                        p: 0.5,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Star sx={{ color: '#ffa726', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption" fontWeight="bold">4.5</Typography>
                      </Box>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ 
                        fontWeight: 700,
                        color: 'primary.dark',
                        mb: 1
                      }}>
                        {product.name}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        {product.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Chip 
                          icon={<LocalOffer />} 
                          label={`₹${product.price}`}
                          color="primary"
                          variant="filled"
                          sx={{ 
                            fontWeight: 700,
                            fontSize: '1rem',
                            px: 1
                          }}
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Quantity Controls */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight="600" color="primary.main">
                          Quantity:
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(product._id, -1)}
                            sx={{ 
                              backgroundColor: 'primary.light',
                              color: 'white',
                              '&:hover': { backgroundColor: 'primary.main' }
                            }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          
                          <TextField
                            size="small"
                            value={quantities[product._id] || 0}
                            onChange={(e) => handleDirectQuantityChange(product._id, e.target.value)}
                            inputProps={{ 
                              min: 0,
                              style: { textAlign: 'center', width: '60px' }
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              }
                            }}
                          />
                          
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(product._id, 1)}
                            sx={{ 
                              backgroundColor: 'primary.main',
                              color: 'white',
                              '&:hover': { backgroundColor: 'primary.dark' }
                            }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {filteredProducts.length === 0 && (
            <Paper sx={{ p: 6, textAlign: 'center', mt: 4 }}>
              <Restaurant sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No dishes found matching your search
              </Typography>
            </Paper>
          )}
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default CreateOrder;