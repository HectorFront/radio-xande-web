import { useState, useEffect } from 'react';
import PostCard from './PostCard';

interface Post {
  id: string;
  title: string;
  content?: string;
  author: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  comments: number;
  type: 'text' | 'video' | 'image';
  mediaUrl?: string;
  thumbnail?: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Amazing live stream from last night!',
    content: 'Check out this incredible performance that happened during the live stream. The energy was absolutely amazing!',
    author: 'musiclover123',
    timestamp: '2 hours ago',
    likes: 245,
    dislikes: 12,
    comments: 34,
    type: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://via.placeholder.com/640x360'
  },
  {
    id: '2',
    title: 'What do you think about the new radio format?',
    content: 'I\'ve been listening to the new format for a few weeks now and I have mixed feelings. The music selection is great but I miss some of the old segments.',
    author: 'radiofan',
    timestamp: '4 hours ago',
    likes: 89,
    dislikes: 23,
    comments: 67,
    type: 'text'
  },
  {
    id: '3',
    title: 'Behind the scenes photo from today\'s recording',
    author: 'studiotech',
    timestamp: '6 hours ago',
    likes: 156,
    dislikes: 5,
    comments: 28,
    type: 'image',
    mediaUrl: 'https://via.placeholder.com/800x600'
  },
  {
    id: '4',
    title: 'Exclusive interview with tonight\'s guest',
    content: 'Don\'t miss this exclusive interview! We talked about their new album, upcoming tour, and some surprising revelations.',
    author: 'hostuser',
    timestamp: '8 hours ago',
    likes: 312,
    dislikes: 18,
    comments: 92,
    type: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://via.placeholder.com/640x360'
  }
];

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleVote = (postId: string, type: 'like' | 'dislike') => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: type === 'like' ? post.likes + 1 : post.likes,
            dislikes: type === 'dislike' ? post.dislikes + 1 : post.dislikes
          };
        }
        return post;
      })
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-neutral-700 border border-neutral-700 rounded-lg p-4 animate-pulse">
            <div className="flex space-x-4">
              <div className="w-12 h-20 bg-neutral-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
                <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
                <div className="h-32 bg-neutral-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          onVote={handleVote}
        />
      ))}
    </div>
  );
}