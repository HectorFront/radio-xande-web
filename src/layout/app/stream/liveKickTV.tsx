export const LiveStreamKickTV = () => {
    return (
        <div className="relative aspect-video w-[480px] max-w-full">
            <iframe 
                width="100%"
                height="100%"
                scrolling="no"
                frameBorder="0" 
                allowFullScreen
                src="https://player.kick.com/superxandao?autoplay=true&muted=true&allowfullscreen=true" 
            />
        </div>
    );
}