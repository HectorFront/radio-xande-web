import { Tab, Tabs } from "@heroui/react";
import { useState } from "react";

const TABS = ["videos", "shorts", "artist"];

export default function Videos() {
    const [tabSelected, setTab] = useState(TABS[0]);
    return (
        <div className="bg-neutral-900 flex-1 w-full h-full rounded-2xl pt-10 px-4 pb-14 lg:px-26">
            <Tabs aria-label="Options" selectedKey={tabSelected} onSelectionChange={setTab}>
                <Tab key="videos" title="Vídeos">
                    <div className="flex flex-col gap-10 overflow-visible">
                    </div>
                </Tab>
                <Tab key="shorts" title="Shorts">
                </Tab>
                 <Tab key="artist" title="Artistas">
                </Tab>
            </Tabs>
        </div>
    );
}