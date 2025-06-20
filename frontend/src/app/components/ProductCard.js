"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Chip,
  Box,
  Stack,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const ProductCard = ({ image, name, description, price, status }) => {
  const theme = useTheme();

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return {
          color: "success",
          icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
          bgColor: alpha(theme.palette.success.main, 0.1),
          borderColor: alpha(theme.palette.success.main, 0.3),
        };
      case "rejected":
        return {
          color: "error",
          icon: <CancelIcon sx={{ fontSize: 16 }} />,
          bgColor: alpha(theme.palette.error.main, 0.1),
          borderColor: alpha(theme.palette.error.main, 0.3),
        };
      case "pending":
        return {
          color: "warning",
          icon: <PendingIcon sx={{ fontSize: 16 }} />,
          bgColor: alpha(theme.palette.warning.main, 0.1),
          borderColor: alpha(theme.palette.warning.main, 0.3),
        };
      default:
        return {
          color: "default",
          icon: <PendingIcon sx={{ fontSize: 16 }} />,
          bgColor: alpha(theme.palette.grey[500], 0.1),
          borderColor: alpha(theme.palette.grey[500], 0.3),
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Card
      sx={{
        minWidth: 280,
        maxWidth: 320,
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          "& .card-media": {
            transform: "scale(1.05)",
          },
          "& .action-buttons": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={name}
          className="card-media"
          sx={{
            transition: "transform 0.3s ease",
            objectFit: "cover",
          }}
        />
        
        {/* Status Badge */}
        <Chip
          icon={statusConfig.icon}
          label={status}
          color={statusConfig.color}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: statusConfig.bgColor,
            border: `1px solid ${statusConfig.borderColor}`,
            backdropFilter: "blur(10px)",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        />

        {/* Action Buttons */}
        <Box
          className="action-buttons"
          sx={{
            position: "absolute",
            bottom: 12,
            right: 12,
            opacity: 0,
            transform: "translateY(10px)",
            transition: "all 0.3s ease",
            display: "flex",
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            sx={{
              bgcolor: alpha("#fff", 0.9),
              backdropFilter: "blur(10px)",
              "&:hover": {
                bgcolor: "#fff",
                transform: "scale(1.1)",
              },
            }}
          >
            <VisibilityIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              bgcolor: alpha("#fff", 0.9),
              backdropFilter: "blur(10px)",
              "&:hover": {
                bgcolor: "#fff",
                transform: "scale(1.1)",
              },
            }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: `linear-gradient(transparent, ${alpha(theme.palette.common.black, 0.1)})`,
            pointerEvents: "none",
          }}
        />
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight="700"
          sx={{
            mb: 1,
            lineHeight: 1.2,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: theme.palette.text.primary,
          }}
        >
          {name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.8em",
          }}
        >
          {description}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: alpha(theme.palette.success.main, 0.1),
              px: 2,
              py: 1,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <CurrencyRupeeIcon
              sx={{
                fontSize: 18,
                color: theme.palette.success.main,
                mr: 0.5,
              }}
            />
            <Typography
              variant="h6"
              fontWeight="700"
              sx={{
                color: theme.palette.success.main,
              }}
            >
              {price}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: statusConfig.color === "success" 
                ? theme.palette.success.main 
                : statusConfig.color === "error" 
                ? theme.palette.error.main 
                : theme.palette.warning.main,
              boxShadow: `0 0 0 3px ${alpha(
                statusConfig.color === "success" 
                  ? theme.palette.success.main 
                  : statusConfig.color === "error" 
                  ? theme.palette.error.main 
                  : theme.palette.warning.main, 
                0.2
              )}`,
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;