import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, TextField,
  Button, CircularProgress, Link,
} from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm]     = useState({ username: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signup(form);
      loginUser(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: "linear-gradient(135deg,#F4F6FB 0%,#EDE9FE 100%)", px: 2 }}
    >
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <AutoAwesome sx={{ color: "primary.main" }} />
            <Typography variant="h5" sx={{ background: "linear-gradient(135deg,#6C63FF,#FF6584)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Vibe
            </Typography>
          </Box>

          <Typography variant="h6" mb={0.5}>Create your account</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Join the community and start sharing.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ minLength: 6 }}
              helperText="At least 6 characters"
            />

            {error && (
              <Typography variant="body2" color="error">{error}</Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Create account"}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" mt={2.5} textAlign="center">
            Already have an account?{" "}
            <Link href="/login" underline="hover" sx={{ color: "primary.main", fontWeight: 600 }}>
              Log in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;