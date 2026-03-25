import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary:   { main: "#6C63FF" },
    secondary: { main: "#FF6584" },
    background: { default: "#F4F6FB", paper: "#FFFFFF" },//F4F6FB
    text: { primary: "#1A1A2E", secondary: "#6B7280" },
  },
  typography: {
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, boxShadow: "none", "&:hover": { boxShadow: "none" } },
        containedPrimary: { background: "linear-gradient(135deg,#6C63FF,#8B5CF6)", color: "#fff" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F0F0F5" },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { "& .MuiOutlinedInput-root": { borderRadius: 10 } },
      },
    },
  },
});

export default theme;