"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");

    if (!storedRole) {
      router.push("/login"); // redirect if role not found
    } else {
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    if (role === "vendor") router.push("/vendorDashboard");
    else if (role === "admin") router.push("/adminDashboard");
    else if (role === "organizer") router.push("/organizerDashboard");
  }, [role]);

  return (
    <div>
      Redirecting to your dashboard...
    </div>
  );
};

export default Dashboard;
