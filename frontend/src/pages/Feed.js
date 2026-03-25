import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, CircularProgress,
  Button, Skeleton, Stack,
} from "@mui/material";
import { getFeed } from "../api";
import { useAuth } from "../context/AuthContext";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";

const LIMIT = 10;

// Skeleton loader for posts while fetching
const PostSkeleton = () => (
  <Box sx={{ bgcolor: "background.paper", borderRadius: 4, p: 2, mb: 2, border: "1px solid #F0F0F5" }}> 
    <Box display="flex" gap={1.5} mb={1.5}>
      <Skeleton variant="circular" width={38} height={38} />
      <Box flex={1}>
        <Skeleton width="30%" height={16} />
        <Skeleton width="15%" height={12} sx={{ mt: 0.5 }} />
      </Box>
    </Box>
    <Skeleton height={14} />
    <Skeleton height={14} width="80%" />
  </Box>
);

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts]         = useState([]);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotal]    = useState(1);
  const [loading, setLoading]     = useState(true);
  const [loadingMore, setMore]    = useState(false);
  const [error, setError]         = useState("");

  const fetchPosts = useCallback(async (pageNum = 1, replace = true) => {
    replace ? setLoading(true) : setMore(true);
    setError("");
    try {
      const res = await getFeed(pageNum, LIMIT);
      setPosts((prev) => replace ? res.data.posts : [...prev, ...res.data.posts]);
      setTotal(res.data.totalPages);
      setPage(pageNum);
    } catch {
      setError("Failed to load posts. Please try again.");
    } finally {
      replace ? setLoading(false) : setMore(false);
    }
  }, []);

  useEffect(() => { fetchPosts(1); }, [fetchPosts]);

  // Prepend a newly created post to the top of the feed (optimistic)
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Remove deleted post from local state
  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          maxWidth: 640,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: 3,
          pb: 6,
        }}
      >
        {/* Feed header */}
        <Typography variant="h6" fontWeight={700} mb={2.5} color="text.primary">
          Home
        </Typography>

        {/* Create post box — only shown when logged in */}
        {user && <CreatePost onPostCreated={handlePostCreated} />}

        {/* Feed */}
        {loading ? (
          <Stack>{[...Array(4)].map((_, i) => <PostSkeleton key={i} />)}</Stack>
        ) : error ? (
          <Box textAlign="center" py={4}>
            <Typography color="error" mb={2}>{error}</Typography>
            <Button variant="outlined" onClick={() => fetchPosts(1)}>Retry</Button>
          </Box>
        ) : posts.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="text.secondary">No posts yet.</Typography>
            <Typography variant="body2" color="text.secondary">Be the first to share something!</Typography>
          </Box>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} />
            ))}

            {/* Pagination — load more */}
            {page < totalPages && (
              <Box textAlign="center" mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => fetchPosts(page + 1, false)}
                  disabled={loadingMore}
                  sx={{ borderRadius: 8 }}
                >
                  {loadingMore ? <CircularProgress size={18} /> : "Load more"}
                </Button>
              </Box>
            )}
            {page >= totalPages && posts.length > 0 && (
              <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={2}>
                You've seen all posts
              </Typography>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default Feed;