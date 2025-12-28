import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Tasks from "@/pages/Tasks";
import Admin from "@/pages/Admin";
import AdminUserDetail from "@/pages/AdminUserDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/users/:userId" element={<AdminUserDetail />} />
        </Route>

        {/* Redirect root to tasks */}
        <Route path="/" element={<Navigate to="/tasks" replace />} />

        {/* Catch all - redirect to tasks */}
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>

      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
