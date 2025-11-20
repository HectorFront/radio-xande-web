import { Music } from "./components/music";
import { Artist } from "./components/artist";
import { Divider, Input, Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { ModelMusics } from "./model";

const TABS = ["all", "music", "artist"];

export default function Home() {
  const [tabSelected, setTab] = useState(TABS[0]);
  const [musics, setMusics] = useState([]);

  useEffect(() => {
    ModelMusics.GetPostMusic()
      .then(setMusics)
      .catch(console.log);
  }, []);

  const ContentMusic = () => (
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
      <div className="flex flex-row items-center">
        {musics.map((music, index) => <Music key={index} music={music}/>)}
      </div>
    </div>
  );

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
    <div className="bg-neutral-900 flex-1 w-full h-full rounded-2xl pt-10 px-4 pb-4 lg:px-26">
      <Tabs aria-label="Options" selectedKey={tabSelected} onSelectionChange={setTab}>
        <Tab key="all" title="Tudo">
          <div className="flex flex-col gap-10">
            <ContentMusic />
            <Divider/>
            <ContentArtist />
          </div>
        </Tab>
        <Tab key="music" title="Músicas">
          <ContentMusic />
        </Tab>
        <Tab key="artist" title="Artistas">
          <ContentArtist />
        </Tab>
      </Tabs>
    </div>
  );
}