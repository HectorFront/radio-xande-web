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
    title: 'Exemplo 1',
    content: 'Descrição do post 1',
    author: 'musiclover123',
    timestamp: '2 horas atrás',
    likes: 245,
    dislikes: 12,
    comments: 34,
    type: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://via.placeholder.com/640x360'
  },
  {
    id: '2',
    title: 'Exemplo 2',
    content: 'Descrição post 2',
    author: 'radiofan',
    timestamp: '4 horas atrás',
    likes: 89,
    dislikes: 23,
    comments: 67,
    type: 'text'
  },
  {
    id: '3',
    title: 'Exemplo 3',
    author: 'Descrição post 3',
    timestamp: '6 horas atrás',
    likes: 156,
    dislikes: 5,
    comments: 28,
    type: 'image',
    mediaUrl: 'https://scontent.cdninstagram.com/v/t51.71878-15/587730601_1569589660735144_3215436608533906169_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=108&ig_cache_key=Mzc3NTc5MTkwNjc1NzM3MjkzNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=cBN51UGE2_gQ7kNvwH0HL8v&_nc_oc=AdnEZ2QOc2nAHE0SEcHfp3xM7V2L7wgHuOgz_4agaJWhUhzvBUeyDnsKWJLEE6cJWRk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=cuYvsmiljrrCGYFFZ4lXpQ&oh=00_AflAj7CVT-qS_WNVEy9lCf9nClXJgFoTr0V1vUx4yPYcsg&oe=6934D22F'
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