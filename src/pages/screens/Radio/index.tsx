import { Music } from "./components/music";
import { Artist } from "./components/artist";
import { Divider, Input, Tab, Tabs } from "@heroui/react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Icon } from "@/components/Icon";
import { ModelMusics } from "./model";
import { MusicProvider } from "@/contexts/MusicContext";

const TABS = ["all", "music", "artist"];

export default function Home() {
  const [tabSelected, setTab] = useState(TABS[0]);
  const [musics, setMusics] = useState([]);

  useEffect(() => {
    ModelMusics.GetPostMusic()
      .then(setMusics)
      .catch(console.log);
  }, []);

  const ContentMusic = useMemo(() => ({ isCarousel = false }: { isCarousel?: boolean }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = useCallback(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    }, []);

    const scroll = useCallback((direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const firstCard = scrollRef.current.querySelector('div');
        const scrollAmount = firstCard ? firstCard.offsetWidth + 20 : 320;
        scrollRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    }, []);

    useEffect(() => {
      if (isCarousel) {
        checkScroll();
        const handleResize = () => checkScroll();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }
    }, [isCarousel, musics, checkScroll]);

    return (
      <div className="flex flex-col">
        <div className="mb-6 flex flex-row flex-wrap items-center gap-10 w-full justify-between">
          <h1 className="text-2xl font-bold">Músicas</h1>
          <Input
            radius="lg"
            isClearable
            className="max-w-[500px]"
            placeholder="Pesquisar Músicas"
            startContent={
              <Icon name="search" style={{ fontSize: 22 }} />
            }
          />
        </div>
        {isCarousel ? (
          <div className="relative overflow-visible">
            <div 
              ref={scrollRef}
              className="flex flex-row items-center gap-5 overflow-x-auto pb-4"
              onScroll={checkScroll}
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                willChange: 'scroll-position'
              }}
            >
              {musics.map((music: any, index) => (
                <div key={music.id || `music-${index}`} className="shrink-0">
                  <Music music={music}/>
                </div>
              ))}
            </div>
            <div className={`absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-neutral-900 to-transparent pointer-events-none z-10 transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-neutral-900 to-transparent pointer-events-none z-10 transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="cursor-pointer absolute -left-4 top-1/2 -translate-y-1/2 z-30 bg-neutral-800/20 hover:bg-neutral-700/50 rounded-full p-3 w-14 h-14 shadow-xl backdrop-blur-sm border border-neutral-600 transition-opacity duration-200"
              >
                <Icon name="chevron_left" style={{ fontSize: 30 }} />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="cursor-pointer absolute -right-4 top-1/2 -translate-y-1/2 z-30 bg-neutral-800/20 hover:bg-neutral-700/50 rounded-full p-3 w-14 h-14 shadow-xl backdrop-blur-sm border border-neutral-600 transition-opacity duration-200"
              >
                <Icon name="chevron_right" style={{ fontSize: 30 }} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-row flex-wrap items-center gap-5">
            {musics.map((music: any, index) => <Music key={music.id || `music-${index}`} music={music}/>)}
          </div>
        )}
      </div>
    );
  }, [musics]);

  const ContentArtist = () => (
    <div className="flex flex-col">
      <div className="mb-6 flex flex-row flex-wrap items-center gap-10 w-full justify-between">
        <h1 className="text-2xl font-bold">Artistas</h1>
        <Input
          radius="lg"
          isClearable
          className="max-w-[500px]"
          placeholder="Pesquisar Artistas"
          startContent={
            <Icon name="search" style={{ fontSize: 22 }} />
          }
        />
      </div>
      <div className="flex flex-row items-center">
        <Artist />
      </div>
    </div>
  );

  return (
    <MusicProvider>
      <div className="bg-neutral-900 flex-1 w-full h-full rounded-2xl pt-10 px-4 pb-4 lg:px-26">
        <Tabs aria-label="Options" selectedKey={tabSelected} onSelectionChange={setTab}>
          <Tab key="all" title="Tudo">
            <div className="flex flex-col gap-10 overflow-visible">
              <ContentMusic isCarousel={true} />
              <Divider/>
              <ContentArtist />
            </div>
          </Tab>
          <Tab key="music" title="Músicas">
            <ContentMusic isCarousel={false} />
          </Tab>
          <Tab key="artist" title="Artistas">
            <ContentArtist />
          </Tab>
        </Tabs>
      </div>
    </MusicProvider>
  );
}