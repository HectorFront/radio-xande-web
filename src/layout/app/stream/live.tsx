export const LiveStream = ({ videoId }: { videoId: string }) => {
    return (
        <div className="relative aspect-video w-96 max-w-full">
            <iframe
                width="100%"
                height="100%"
                allowFullScreen
                className="rounded-xl"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1`}
            />
        </div>
    );
}