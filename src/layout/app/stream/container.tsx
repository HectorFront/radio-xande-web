import BannerHeader from "@/assets/banner_header.jpg";
import { useEffect, useState } from "react";
import { LiveStream } from "./live";
import { StreamStatus } from "./status";
import { ModelStream } from "./model";
import { ModelApp } from "../model";
import clsx from "clsx";
import { Render } from "@/components";
import { Button, Card, CardBody } from "@heroui/react";

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

type AdProps = {
    description?: null | string;
    description_url: null | string;
    url_attached: null | string;
};

export const ContainerStream = () => {
    const [stream, setStream] = useState(INITIAL_STATE);
    const [ad, setAd] = useState<AdProps | null>(null);

    const getAd = () => {
        ModelApp.GetUniqueAd()
            .then(data => setAd(data))
    };

    const getSreamStatus = () => {
        ModelStream.GetYouTubeStreamUnique()
            .then(data => setStream(data))
            .catch(error => console.error("Failed to fetch stream data:", error));
    };

    useEffect(() => {
        getAd();
        getSreamStatus();
    }, []);

    return (
        <div className={clsx(stream.is_live ? "min-h-60" : "min-h-30", "w-full bg-center gap-4 bg-cover flex flex-col py-4 px-4 lg:px-10")} style={{ backgroundImage: `url(${BannerHeader})` }}>
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
                <StreamStatus 
                    title={stream.title} 
                    online={stream.is_live}
                    videoId={stream.video_id}
                />
                <Render test={stream.is_live}>
                    <LiveStream videoId={stream.video_id}/>
                </Render>
            </div>
        </div>
    );
}