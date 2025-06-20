"use client";
import React from "react";
import {
  Box, Button, TextField, Typography, Stack
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../utils/axiosInstance";
import { useRouter } from "next/navigation";

const CreateProduct = () => {
  const router = useRouter();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      image: null
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      price: Yup.number().required("Required").positive(),
      image: Yup.mixed().required("Image is required")
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("image", values.image);
      formData.append("vendorEmail", email);
      console.log(formData, "The Product Submitted")

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
      }
    }
  });

  return (
    <Box p={3} maxWidth={600} mx="auto">
      <Typography variant="h5" mb={2}>Create Product</Typography>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <Stack spacing={2}>
          <TextField
            label="Product Name"
            name="name"
            fullWidth
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && !!formik.errors.description}
            helperText={formik.touched.description && formik.errors.description}
          />
          <TextField
            label="Price (in ₹)"
            name="price"
            fullWidth
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && !!formik.errors.price}
            helperText={formik.touched.price && formik.errors.price}
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(event) => {
              formik.setFieldValue("image", event.currentTarget.files[0]);
            }}
          />
          {formik.touched.image && formik.errors.image && (
            <Typography color="error" fontSize={12}>{formik.errors.image}</Typography>
          )}

          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CreateProduct;
