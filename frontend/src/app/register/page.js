"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Container,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, Restaurant } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const roles = ["admin", "vendor", "organizer"];

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .matches(/[a-zA-Z]/, "Must include letters")
    .matches(/[0-9]/, "Must include numbers")
    .required("Password is required"),
  role: Yup.string().required("Role is required"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log("Register form values:", values);

      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            name: values.name,
            email: values.email,
            password: values.password,
            role: values.role,
          }
        );

        console.log("✅ Register Success:", res.data);
        router.push("/login");
        alert("Registration successful! 🎉");
        resetForm();
      } catch (error) {
        const message = error.response?.data?.message || "Registration failed";

        if (message === "User already exists") {
          alert("User already exists");
          resetForm();
        } else {
          alert("Error: " + message);
        }

        console.error("❌ Register Error:", message);
      }
    },
  });

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      {/* Left Side - Register Form */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.6 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4 },
          height: "100%",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            }}
          >
            {/* Mobile Header - Only visible on small screens */}
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                textAlign: "center",
                mb: 4,
              }}
            >
              <Restaurant sx={{ fontSize: 40, color: "#ff6b35", mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                FoodieHub
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: "700",
                mb: 1,
                color: "white",
                textAlign: "center",
              }}
            >
              Join FoodieHub
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                textAlign: "center",
                mb: 4,
              }}
            >
              Create your account to get started
            </Typography>

            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                margin="normal"
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "white",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      border: "1px solid rgba(255, 107, 53, 0.5)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.8)",
                    "&.Mui-focused": {
                      color: "#ff6b35",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                margin="normal"
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "white",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      border: "1px solid rgba(255, 107, 53, 0.5)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.8)",
                    "&.Mui-focused": {
                      color: "#ff6b35",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                margin="normal"
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "white",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      border: "1px solid rgba(255, 107, 53, 0.5)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.8)",
                    "&.Mui-focused": {
                      color: "#ff6b35",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "rgba(255, 255, 255, 0.8)",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                select
                label="Role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                margin="normal"
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "white",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      border: "1px solid rgba(255, 107, 53, 0.5)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.8)",
                    "&.Mui-focused": {
                      color: "#ff6b35",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              >
                {roles.map((role) => (
                  <MenuItem 
                    key={role} 
                    value={role}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      color: "#333",
                      "&:hover": {
                        backgroundColor: "rgba(255, 107, 53, 0.1)",
                      },
                    }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  mb: 3,
                  py: 1.5,
                  borderRadius: 2,
                  backgroundColor: "#ff6b35",
                  boxShadow: "0 4px 14px 0 rgba(255, 107, 53, 0.4)",
                  "&:hover": {
                    backgroundColor: "#e55a2b",
                    boxShadow: "0 6px 20px 0 rgba(255, 107, 53, 0.6)",
                  },
                  fontWeight: "600",
                  fontSize: "1.1rem",
                }}
              >
                Create Account
              </Button>

              <Box
                sx={{
                  textAlign: "center",
                  mt: 3,
                }}
              >
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  Already have an account?{" "}
                  <Button
                    variant="text"
                    onClick={() => router.push("/login")}
                    sx={{
                      color: "#ff6b35",
                      fontWeight: "600",
                      textTransform: "none",
                      p: 0,
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign in
                  </Button>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>

      {/* Right Side - Brand Section */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            color: "white",
            zIndex: 1,
          }}
        >
          <Restaurant sx={{ fontSize: 80, mb: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Welcome to FoodieHub
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              maxWidth: 400,
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Join thousands of food lovers and discover amazing restaurants in your area
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;