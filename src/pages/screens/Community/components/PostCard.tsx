import { Icon, VideoPlayer } from "@/components";
import { Button, ButtonGroup } from "@heroui/react";
import clsx from "clsx";
import { useState } from "react";

interface PostCardProps {
  post: {
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
  };
  onVote: (postId: string, type: 'like' | 'dislike') => void;
}

export default function PostCard({ post, onVote }: PostCardProps) {
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const renderMedia = () => {
    if (post.type === 'video' && post.mediaUrl) {
      return (
        <div className="mt-3 relative" onClick={e => e.stopPropagation()}>
          <VideoPlayer
            controls={true}
            autoPlay={false}
            controlBar={{
              screenshot: true,
              pictureInPictureToggle: true
            }}
            srcVideo={post.mediaUrl}
          />
        </div>
      );
    };
    if (post.type === 'image' && post.mediaUrl) {
      return (
        <div className="mt-3" onClick={e => e.stopPropagation()}>
          <img 
            src={post.mediaUrl} 
            alt={post.title}
            className="w-full rounded-lg max-h-96 object-cover"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="group cursor-pointer bg-neutral-800 border border-neutral-700 rounded-lg mb-4 hover:border-neutral-500 transition-colors">
      <div className="flex">
        {/* Vote section */}
        <div className="flex flex-col items-center p-2 bg-neutral-700 rounded-l-lg">
          <span className="text-sm font-bold text-neutral-200">
            {post.likes}
          </span>
          <button 
            onClick={() => {
              onVote(post.id, 'like');
              setDislike(false);
              setLike(!like);
            }}
            className="group w-10 h-10 flex items-center justify-center hover:bg-neutral-900 rounded-full cursor-pointer"
          >
            <Icon filled={like} name="favorite" style={{ fontSize: 25 }} className={clsx(like ? "text-red-400" : "text-neutral-400", "group-hover:text-white")}/>
          </button>
          <button 
            onClick={() => {
              onVote(post.id, 'dislike');
              setLike(false);
              setDislike(!dislike);
            }}
            className="group w-10 h-10 flex items-center justify-center hover:bg-neutral-900 rounded-full cursor-pointer"
          >
            <Icon filled={dislike} name="thumb_down" style={{ fontSize: 25 }} className={clsx(dislike ? "text-white" : "text-neutral-400", "group-hover:text-white")}/>
          </button>
          <span className="text-sm font-bold text-neutral-200">
            {post.dislikes}
          </span>
        </div>

        {/* Content section */}
        <div className="flex-1 p-4">
          <div className="flex items-center text-xs text-neutral-400 mb-2">
            <span>StompeMIX/comunidade</span>
            <span className="mx-1">•</span>
            <span>Publicado por u/{post.author}</span>
            <span className="mx-1">•</span>
            <span>{post.timestamp}</span>
          </div>
          
          <h3 className="text-lg font-medium text-neutral-100 mb-2">
            {post.title}
          </h3>
          
          {post.content && (
            <p className="text-neutral-300 text-sm mb-3 line-clamp-3">
              {post.content}
            </p>
          )}
          
          {renderMedia()}
          
          <div className="flex items-center space-x-4 mt-3 text-xs text-neutral-400">
            <ButtonGroup radius="full" color="default" size="sm">
              <Button>
                <Icon name="forum" style={{ fontSize: 20 }}/>
                <span>{post.comments}</span>
              </Button>
              <Button>
                <Icon name="share_windows" style={{ fontSize: 20 }}/>Compartilhar
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
}