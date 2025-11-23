import BannerHeader from "@/assets/banner_header.jpg";
import { useEffect, useState } from "react";
import { LiveStream } from "./live";
import { StreamStatus } from "./status";
import { ModelStream } from "./model";
import clsx from "clsx";
import { Render } from "@/components";

export type StreamProps = {
    is_live: boolean;
    live_chat_id: string | null;
    started_at: string | null;
    thumbnail_url: string | null;
    title: string | null;
    video_id: string | null;
}

const INITIAL_STATE: StreamProps = {
    is_live: false,
    live_chat_id: null,
    started_at: null,
    thumbnail_url: null,
    title: null,
    video_id: null
};

export const ContainerStream = () => {
    const [stream, setStream] = useState(INITIAL_STATE);

    useEffect(() => {
        ModelStream.GetYouTubeStreamUnique("UCSJ4gkVC6NrvII8umztf0Ow")
            .then(data => setStream(data))
            .catch(error => console.error("Failed to fetch stream data:", error));
    }, []);

    return (
        <div className={clsx(stream.is_live ? "min-h-60" : "min-h-30", "w-full bg-center gap-4 bg-cover flex flex-row flex-wrap items-center justify-between py-4 px-4 lg:px-10")} style={{ backgroundImage: `url(${BannerHeader})` }}>
            <StreamStatus title={stream.title} online={stream.is_live} />
            <Render test={stream.is_live}>
                <LiveStream videoId={stream.video_id}/>
            </Render>
        </div>
    );
}