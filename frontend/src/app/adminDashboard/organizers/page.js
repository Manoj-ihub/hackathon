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

const OrganizersPage = () => {
  const token = localStorage.getItem("token");
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const res = await axios.get("/api/admin/users/organizers", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrganizers(res.data);
      } catch (err) {
        console.error("Error fetching organizers:", err);
      }
    };

    fetchOrganizers();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>All Organizers</Typography>
      <Paper>
        <List>
          {organizers.map((org) => (
            <ListItem key={org._id}>
              <ListItemText
                primary={org.name}
                secondary={org.email}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default OrganizersPage;
