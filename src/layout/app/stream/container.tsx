import BannerHeader from "@/assets/banner_header.jpg";
import { useLayoutEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LiveStreamYouTube } from "./liveYouTube";
import { StreamStatusYT } from "./statusYouTube";
import { StreamStatusKickTV } from "./statusKickTV";
import { ModelStream } from "./model";
import { ModelApp } from "../model";
import clsx from "clsx";
import { Render } from "@/components";
import { Button, Card, CardBody } from "@heroui/react";
import { KickChannelProps, YouTubeChannelProps } from "./types";
import { LiveStreamKickTV } from "./liveKickTV";

const INITIAL_STATE_YT_CHANNEL: YouTubeChannelProps = {
    is_live: false,
    live_chat_id: null,
    started_at: null,
    thumbnail_url: null,
    title: null,
    video_id: null
};

export const INITIAL_STATE_KICK_CHANNEL: KickChannelProps = {
    id: 0,
    user_id: 0,
    slug: null as any,
    is_banned: false,
    playback_url: null,
    vod_enabled: false,
    subscription_enabled: false,
    is_affiliate: false,
    followers_count: 0,
    subscriber_badges: [],
    banner_image: { url: null },
    livestream: null,
    role: null,
    muted: false,
    follower_badges: [],
    offline_banner_image: {
        src: null,
        srcset: null,
    },
    verified: false,
    recent_categories: [],
    can_host: false,
    user: null,
    chatroom: null,
};

type AdProps = {
    description?: null | string;
    description_url: null | string;
    url_attached: null | string;
};

export const ContainerStream = () => {
    const [streamYT, setStreamYT] = useState(INITIAL_STATE_YT_CHANNEL);
    const [ad, setAd] = useState<AdProps | null>(null);

    const { data: streamKick = INITIAL_STATE_KICK_CHANNEL } = useQuery({
        queryKey: ['kickTVStreamStatus'],
        queryFn: () => ModelStream.GetKickTVStreamStatus(),
        staleTime: 60 * 1000, // 1 minute
        gcTime: 60 * 1000 // 1 minute
    });

    const getAd = () => {
        ModelApp.GetUniqueAd()
            .then(data => setAd(data))
    };

    const getStreamYTStatus = () => {
        ModelStream.GetYouTubeStreamStatus()
            .then((data: YouTubeChannelProps) => setStreamYT(data))
            .catch(error => console.error("Failed to fetch stream YouTube data:", error));
    };

    useLayoutEffect(() => {
        getAd();
        getStreamYTStatus();
    }, []);

    const OrderStreams = useMemo(() => {
        const StreamYTComponent = (
            <StreamStatusYT
                key="stream-yt"
                title={streamYT.title}
                online={streamYT.is_live}
                videoId={streamYT.video_id}
            />
        );
        const StreamKickTVComponent = (
            <StreamStatusKickTV
                key="stream-kick"
                online={streamKick.livestream?.is_live}
                title={streamKick.livestream?.session_title}
            />
        );
        if (streamKick.livestream?.is_live) {
            return [StreamKickTVComponent, StreamYTComponent];
        }
        if (streamYT.is_live) {
            return [StreamYTComponent, StreamKickTVComponent];
        }
        return [StreamYTComponent, StreamKickTVComponent];
    }, [streamYT, streamKick]);

    return (
        <div className={clsx(streamYT.is_live ? "min-h-60" : "min-h-30", "w-full bg-center gap-4 bg-cover flex flex-col py-4 px-4 lg:px-10")} style={{ backgroundImage: `url(${BannerHeader})` }}>
            <Card className="max-w-fit bg-black/80 border-white/20 mx-auto">
                <Render test={ad}>
                    <CardBody className="flex flex-row flex-wrap items-center px-5 gap-5">
                        <span className="font-bold text-lg">
                            {ad?.description}
                        </span>
                        <Render test={ad?.description_url && ad?.url_attached}>
                            <Button color="primary" href="#" variant="shadow" className="font-bold">
                                <span className="text-white">{ad?.description_url}</span>
                            </Button>
                        </Render>
                    </CardBody>
                </Render>
            </Card>
            <div className="flex flex-row items-center flex-wrap justify-between gap-5">
                <div className="flex flex-row flex-wrap gap-5 items-start max-w-full">
                    {OrderStreams}
                </div>
                <Render test={streamKick.livestream?.is_live}>
                    <LiveStreamKickTV />
                </Render>
                <Render test={streamYT.is_live}>
                    <LiveStreamYouTube videoId={streamYT.video_id} />
                </Render>
            </div>
        </div>
    );
}