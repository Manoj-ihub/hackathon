"use client";
import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";

const ProductCard = ({ image, name, description, price, status }) => {
  return (
    <Card sx={{ minWidth: 200, margin: 1 }}>
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={name}
      />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" color="primary">
          ₹{price}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Status: {status}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
