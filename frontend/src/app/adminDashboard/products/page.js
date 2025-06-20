"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  InputAdornment,
  TextField,
  Chip,
  Stack,
  Fade,
  Skeleton,
  useTheme,
  alpha,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ViewModule as ViewModuleIcon,
  Restaurant as RestaurantIcon,
} from "@mui/icons-material";
import axios from "../../utils/axiosInstance";
import ProductCard from "../../components/ProductCard";

const AllProductsPage = () => {
  const theme = useTheme();
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admin/products/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Error fetching all products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  // Filter products based on search and status
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.vendorEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (product) => product.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedStatus]);

  const getStatusCount = (status) => {
    return products.filter(p => p.status.toLowerCase() === status.toLowerCase()).length;
  };

  const statusFilters = [
    { label: "All Products", value: "all", count: products.length },
    { label: "Approved", value: "approved", count: getStatusCount("approved") },
    { label: "Pending", value: "pending", count: getStatusCount("pending") },
    { label: "Rejected", value: "rejected", count: getStatusCount("rejected") },
  ];

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Paper
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
            }}
          >
            <Skeleton variant="rectangular" height={200} />
            <Box sx={{ p: 3 }}>
              <Skeleton variant="text" height={32} width="80%" />
              <Skeleton variant="text" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={20} width="60%" />
              <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                <Skeleton variant="rectangular" height={32} width={80} sx={{ borderRadius: 2 }} />
                <Skeleton variant="circular" width={8} height={8} />
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          borderRadius: 0,
          mb: 4,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 6 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha("#fff", 0.15),
                  backdropFilter: "blur(10px)",
                }}
              >
                <RestaurantIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  fontWeight="800"
                  sx={{
                    background: "linear-gradient(45deg, #fff, #e3f2fd)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  All Products
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
                  Manage and monitor all food items across vendors
                </Typography>
              </Box>
            </Stack>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {statusFilters.map((filter, index) => (
                <Grid item xs={6} sm={3} key={filter.value}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: alpha("#fff", 0.1),
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${alpha("#fff", 0.2)}`,
                      borderRadius: 3,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: alpha("#fff", 0.15),
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => setSelectedStatus(filter.value)}
                  >
                    <Typography variant="h4" fontWeight="700" color="white">
                      {filter.count}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, color: "white" }}>
                      {filter.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl">
        {/* Search and Filter Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center">
            {/* Search Bar */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products, descriptions, or vendor emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: { md: 400 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                  "&.Mui-focused": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                },
              }}
            />

            {/* Status Filter Chips */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {statusFilters.map((filter) => (
                <Chip
                  key={filter.value}
                  label={`${filter.label} (${filter.count})`}
                  onClick={() => setSelectedStatus(filter.value)}
                  variant={selectedStatus === filter.value ? "filled" : "outlined"}
                  color={selectedStatus === filter.value ? "primary" : "default"}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              ))}
            </Stack>
          </Stack>

          {/* Results Info */}
          <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${alpha(theme.palette.grey[300], 0.3)}` }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <ViewModuleIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="body1" color="text.secondary">
                Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
                {searchTerm && (
                  <span> matching "<strong>{searchTerm}</strong>"</span>
                )}
              </Typography>
            </Stack>
          </Box>
        </Paper>

        {/* Products Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredProducts.length === 0 ? (
          <Paper
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 3,
              border: `2px dashed ${alpha(theme.palette.grey[400], 0.5)}`,
            }}
          >
            <RestaurantIcon sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm
                ? `No products match your search "${searchTerm}"`
                : "No products available at the moment"}
            </Typography>
          </Paper>
        ) : (
          <Fade in={!loading} timeout={600}>
            <Grid container spacing={3} sx={{ pb: 6 }}>
              {filteredProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <Fade in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                    <div>
                      <ProductCard
                        image={`http://localhost:5000/${product?.image}`}
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        status={product.status}
                        vendorEmail={product.vendorEmail}
                      />
                    </div>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default AllProductsPage;