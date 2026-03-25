import React, { useState } from "react";
import {
  Card, CardContent, CardMedia, Box, Avatar,
  Typography, IconButton, TextField,
  Collapse, Divider, Tooltip,
} from "@mui/material";
import {
  FavoriteBorder, Favorite, ChatBubbleOutline,
  DeleteOutline, Send,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { likePost, commentPost, deletePost } from "../api";


const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();

  
  const [likes, setLikes]               = useState(post.likes || []);
  const [comments, setComments]         = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText]   = useState("");
  const [submitting, setSubmitting]     = useState(false);

  const isLiked  = user && likes.includes(user.username);
  const isOwner  = user && user._id === post.userId;

  
  const handleLike = async () => {
    if (!user) return;
    
    setLikes((prev) =>
      isLiked ? prev.filter((u) => u !== user.username) : [...prev, user.username]
    );
    try {
      const res = await likePost(post._id);
      setLikes(res.data.likes);
    } catch {
      
      setLikes((prev) =>
        isLiked ? [...prev, user.username] : prev.filter((u) => u !== user.username)
      );
    }
  };

  
  const handleComment = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await commentPost(post._id, commentText.trim());
      setComments((prev) => [...prev, res.data.comment]);
      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  
  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      onDelete(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ pb: 1 }}>
        
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Box display="flex" gap={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: "secondary.main", fontWeight: 700, width: 38, height: 38, fontSize: 15 }}>
              {post.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={700}>{post.username}</Typography>
              <Typography variant="caption" color="text.secondary">{timeAgo(post.createdAt)}</Typography>
            </Box>
          </Box>
          {isOwner && (
            <Tooltip title="Delete post">
              <IconButton size="small" onClick={handleDelete} sx={{ color: "text.secondary" }}>
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        
        {post.text && (
          <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.65, color: "text.primary" }}>
            {post.text}
          </Typography>
        )}
      </CardContent>

      
      {post.imageUrl && (
        <CardMedia
          component="img"
          image={post.imageUrl}
          alt="post"
          sx={{ maxHeight: 420, objectFit: "cover" }}
        />
      )}

      
      <CardContent sx={{ pt: 1, pb: "12px !important" }}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <IconButton size="small" onClick={handleLike} sx={{ color: isLiked ? "secondary.main" : "text.secondary" }}>
            {isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
          </IconButton>
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 20 }}>
            {likes.length > 0 ? likes.length : ""}
          </Typography>

          <IconButton
            size="small"
            onClick={() => setShowComments((v) => !v)}
            sx={{ color: showComments ? "primary.main" : "text.secondary", ml: 0.5 }}
          >
            <ChatBubbleOutline fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {comments.length > 0 ? comments.length : ""}
          </Typography>

          
          {likes.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
              {likes.slice(0, 3).join(", ")}{likes.length > 3 ? ` +${likes.length - 3}` : ""} liked
            </Typography>
          )}
        </Box>

       
        <Collapse in={showComments}>
          <Divider sx={{ my: 1 }} />

        
          {comments.length === 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              No comments yet. Be the first!
            </Typography>
          )}
          {comments.map((c, i) => (
            <Box key={c._id || i} display="flex" gap={1} mb={1} alignItems="flex-start">
              <Avatar sx={{ width: 26, height: 26, bgcolor: "primary.light", fontSize: 11, fontWeight: 700 }}>
                {c.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ bgcolor: "background.default", borderRadius: 2, px: 1.5, py: 0.75, flex: 1 }}>
                <Typography variant="caption" fontWeight={700}>{c.username} </Typography>
                <Typography variant="caption" color="text.secondary">{c.text}</Typography>
              </Box>
            </Box>
          ))}

          
          {user && (
            <Box display="flex" gap={1} mt={1} alignItems="center">
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
                sx={{ "& fieldset": { borderColor: "#EBEBF5" } }}
              />
              <IconButton
                size="small"
                onClick={handleComment}
                disabled={!commentText.trim() || submitting}
                sx={{ color: "primary.main" }}
              >
                <Send fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default PostCard;