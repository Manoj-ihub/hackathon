"use client";
import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, Stack, Paper, Avatar, Fade, Slide
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CloudUpload, Restaurant, AttachMoney, Description, Image as ImageIcon } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from '../../utils/axiosInstance'
import { useRouter } from 'next/navigation'

// Create a custom blue theme
const blueTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#0d47a1',
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
      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 20px rgba(25, 118, 210, 0.25)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 32px',
          boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
          },
        },
      },
    },
  },
});

const CreateProduct = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter()
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      image: null
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number().required("Price is required").positive("Price must be positive"),
      image: Yup.mixed().required("Image is required")
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("image", values.image);
      formData.append("vendorEmail", email);

      try {
        await axios.post("/api/vendor/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        });
        alert("Product created successfully");
        router.push("/vendorDashboard");
      } catch (error) {
        console.error("Product creation failed:", error);
        alert("Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
      
    }
  });

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <ThemeProvider theme={blueTheme}>
      <Box 
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          py: 4,
          px: 2
        }}
      >
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              maxWidth: 700,
              mx: 'auto',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(25, 118, 210, 0.1)',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                p: 4,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Restaurant sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" component="h1" sx={{ mb: 1, position: 'relative', zIndex: 1, color: 'white' }}>
                Create New Product
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, position: 'relative', zIndex: 1 }}>
                Add a new product to your store
              </Typography>
            </Box>

            {/* Form */}
            <Box p={4}>
              <form onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <Slide direction="up" in timeout={600}>
                    <TextField
                      label="Product Name"
                      name="name"
                      fullWidth
                      placeholder="e.g., Margherita Pizza"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && !!formik.errors.name}
                      helperText={formik.touched.name && formik.errors.name}
                      InputProps={{
                        startAdornment: <Restaurant sx={{ mr: 1, color: 'primary.main' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(25, 118, 210, 0.02)',
                        }
                      }}
                    />
                  </Slide>

                  <Slide direction="up" in timeout={700}>
                    <TextField
                      label="Description"
                      name="description"
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Describe your delicious product..."
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      error={formik.touched.description && !!formik.errors.description}
                      helperText={formik.touched.description && formik.errors.description}
                      InputProps={{
                        startAdornment: <Description sx={{ mr: 1, mt: -3, color: 'primary.main' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(25, 118, 210, 0.02)',
                        }
                      }}
                    />
                  </Slide>

                  <Slide direction="up" in timeout={800}>
                    <TextField
                      label="Price"
                      name="price"
                      fullWidth
                      type="number"
                      placeholder="0.00"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      error={formik.touched.price && !!formik.errors.price}
                      helperText={formik.touched.price && formik.errors.price}
                      
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(25, 118, 210, 0.02)',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield', // for Firefox
                        }
                      }}
                    />
                  </Slide>

                  {/* Image Upload */}
                  <Slide direction="up" in timeout={900}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                        Product Image
                      </Typography>
                      <Box
                        sx={{
                          border: '2px dashed',
                          borderColor: formik.touched.image && formik.errors.image ? 'error.main' : 'primary.light',
                          borderRadius: 2,
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: imagePreview ? 'transparent' : 'rgba(25, 118, 210, 0.02)',
                          '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'rgba(25, 118, 210, 0.05)',
                            transform: 'translateY(-2px)',
                          }
                        }}
                        onClick={() => document.getElementById('image-upload').click()}
                      >
                        {imagePreview ? (
                          <Box>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: '100%',
                                maxWidth: 200,
                                height: 150,
                                objectFit: 'cover',
                                borderRadius: 8,
                                marginBottom: 12
                              }}
                            />
                            <Typography variant="body2" color="primary.main">
                              Click to change image
                            </Typography>
                          </Box>
                        ) : (
                          <Box>
                            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6" color="primary.main" gutterBottom>
                              Upload Product Image
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Click to select or drag and drop
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              PNG, JPG up to 10MB
                            </Typography>
                          </Box>
                        )}
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                      </Box>
                      {formik.touched.image && formik.errors.image && (
                        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                          {formik.errors.image}
                        </Typography>
                      )}
                    </Box>
                  </Slide>

                  <Slide direction="up" in timeout={1000}>
                    <Button
                      variant="contained"
                      type="submit"
                      size="large"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? null : <CloudUpload />}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        fontSize: '1.1rem',
                        '&:disabled': {
                          background: 'linear-gradient(45deg, #ccc 30%, #ddd 90%)',
                        }
                      }}
                    >
                      {isSubmitting ? 'Creating Product...' : 'Create Product'}
                    </Button>
                  </Slide>
                </Stack>
              </form>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </ThemeProvider>
  );
};

export default CreateProduct;