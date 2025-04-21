import React from 'react';
import { getAuth } from "firebase/auth";
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Welcome, {user.email}</p>
      {/* Additional dashboard content and admin monitoring can be added here */}
    </div>
  );
}
