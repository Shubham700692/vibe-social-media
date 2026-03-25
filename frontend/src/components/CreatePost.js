import React, { useState, useRef } from "react";
import {
  Card, CardContent, Box, Avatar, TextField, Button,
  IconButton, Tooltip, CircularProgress, Collapse,
} from "@mui/material";
import { ImageOutlined, Close } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../api";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText]         = useState("");
  const [imageFile, setImage]   = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const fileRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!text.trim() && !imageFile) return;
    setLoading(true);
    setError("");

    // Use FormData so multer can handle the optional image file
    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());
    if (imageFile)   formData.append("image", imageFile);

    try {
      const res = await createPost(formData);
      onPostCreated(res.data); // lift new post to feed
      setText("");
      removeImage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2.5 }}>
      <CardContent sx={{ pb: "16px !important" }}>
        <Box display="flex" gap={1.5} alignItems="flex-start">
          <Avatar sx={{ bgcolor: "primary.main", fontWeight: 700, width: 38, height: 38, fontSize: 15 }}>
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box flex={1}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 1, "& fieldset": { borderColor: "#EBEBF5" } }}
            />

            {/* Image preview */}
            <Collapse in={!!preview}>
              <Box position="relative" display="inline-block" mb={1}>
                <img
                  src={preview}
                  alt="preview"
                  style={{ maxHeight: 200, maxWidth: "100%", borderRadius: 10, display: "block" }}
                />
                <IconButton
                  size="small"
                  onClick={removeImage}
                  sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(0,0,0,0.5)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </Collapse>

            {error && (
              <Box sx={{ color: "error.main", fontSize: 13, mb: 1 }}>{error}</Box>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Tooltip title="Add image">
                <IconButton size="small" onClick={() => fileRef.current.click()} sx={{ color: "primary.main" }}>
                  <ImageOutlined />
                </IconButton>
              </Tooltip>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageChange} />

              <Button
                variant="contained"
                size="small"
                disabled={(!text.trim() && !imageFile) || loading}
                onClick={handleSubmit}
                sx={{ minWidth: 80, borderRadius: 8 }}
              >
                {loading ? <CircularProgress size={16} color="inherit" /> : "Post"}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;