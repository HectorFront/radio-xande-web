export interface KickBadgeImage {
  srcset: string | null;
  src: string | null;
}

export interface KickSubscriberBadge {
  id: number;
  channel_id: number;
  months: number;
  badge_image: KickBadgeImage;
}

export interface KickBannerImage {
  url: string | null;
}

export interface KickOfflineBannerImage {
  src: string | null;
  srcset: string | null;
}

export interface KickCategoryBase {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

export interface KickCategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  tags: string[];
  description: string | null;
  deleted_at: string | null;
  is_mature: boolean;
  is_promoted: boolean;
  viewers: number;
  is_fallback: boolean;
  category: KickCategoryBase;
}

export interface KickLivestream {
  id: number;
  slug: string;
  channel_id: number;
  created_at: string;
  session_title: string;
  is_live: boolean;
  risk_level_id: number | null;
  start_time: string;
  source: string | null;
  twitch_channel: string | null;
  duration: number;
  language: string;
  is_mature: boolean;
  viewer_count: number;
  thumbnail: string | null;
  lang_iso: string;
  tags: string[];
  categories: KickCategory[];
}

export interface KickUser {
  id: number;
  username: string;
  agreed_to_terms: boolean;
  email_verified_at: string | null;
  bio: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  discord: string | null;
  tiktok: string | null;
  facebook: string | null;
  gender: string | null;
  profile_pic: string | null;
}

export interface KickChatroom {
  id: number;
  chatable_type: string;
  channel_id: number;
  created_at: string | null;
  updated_at: string | null;
  chat_mode_old: string;
  chat_mode: string;
  slow_mode: boolean;
  chatable_id: number;
  followers_mode: boolean;
  subscribers_mode: boolean;
  emotes_mode: boolean;
  message_interval: number;
  following_min_duration: number;
}

export interface KickChannelProps {
  id: number;
  user_id: number;
  slug: string;
  is_banned: boolean;
  playback_url: string | null;
  vod_enabled: boolean;
  subscription_enabled: boolean;
  is_affiliate: boolean;
  followers_count: number;
  subscriber_badges: KickSubscriberBadge[];
  banner_image: KickBannerImage | null;
  livestream: KickLivestream | null;
  role: string | null;
  muted: boolean;
  follower_badges: any[];
  offline_banner_image: KickOfflineBannerImage | null;
  verified: boolean;
  recent_categories: KickCategory[];
  can_host: boolean;
  user: KickUser | null;
  chatroom: KickChatroom | null;
}

export type YouTubeChannelProps = {
    is_live: boolean;
    live_chat_id: string | null;
    started_at: string | null;
    thumbnail_url: string | null;
    title: string | null;
    video_id: string | null;
}