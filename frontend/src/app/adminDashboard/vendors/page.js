"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper
} from "@mui/material";
import axios from "../../utils/axiosInstance";

const VendorsPage = () => {
  const token = localStorage.getItem("token");
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get("/api/admin/users/vendors", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVendors(res.data);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };

    fetchVendors();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>All Vendors</Typography>
      <Paper>
        <List>
          {vendors.map((vendor) => (
            <ListItem key={vendor._id}>
              <ListItemText
                primary={vendor.name}
                secondary={vendor.email}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default VendorsPage;
