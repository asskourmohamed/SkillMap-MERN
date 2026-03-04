import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppHeader from '../components/Layout/AppHeader';
import PostCreator from '../components/Feed/PostCreator';
import PostCard from '../components/Feed/PostCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { postService } from '../services/postService';
import { useToast } from '../context/ToastContext';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const toast = useToast();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchFeed();
  }, []);

  const fetchFeed = async (page = 1) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await postService.getFeed(page, pagination.limit);
      const newPosts = response.data.data;
      const newPagination = response.data.pagination;

      setPosts(prev => page === 1 ? newPosts : [...prev, ...newPosts]);
      setPagination(newPagination);
      setHasMore(page < newPagination.pages);
    } catch (error) {
      console.error('Erreur chargement feed:', error);
      toast.error('Erreur lors du chargement des posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Observer pour l'infinite scroll
  const lastPostRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchFeed(pagination.page + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, loadingMore, hasMore, pagination.page]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdated = () => {
    fetchFeed(1); // Recharger le feed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <AppHeader user={currentUser} />
        <LoadingSpinner fullPage text="Chargement du feed..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <AppHeader user={currentUser} />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Actualité</h1>
        
        {/* Créateur de post */}
        <PostCreator 
          user={currentUser} 
          onPostCreated={handlePostCreated}
        />

        {/* Liste des posts */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={post._id}
              ref={index === posts.length - 1 ? lastPostRef : null}
            >
              <PostCard
                post={post}
                currentUser={currentUser}
                onPostUpdated={handlePostUpdated}
              />
            </div>
          ))}
        </div>

        {/* Loading more indicator */}
        {loadingMore && (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="medium" />
          </div>
        )}

        {/* No posts */}
        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">newspaper</span>
            <p className="text-slate-500 text-lg">Aucun post pour le moment</p>
            <p className="text-slate-400 text-sm mt-2">Soyez le premier à partager quelque chose !</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default FeedPage;