import { Icon } from "@/components";
import ImgBadgeCheckDefault from "@/assets/badge-check.png";
import ImgBadgeCheckGold from "@/assets/badge-check-gold.png";
import { Button, Chip, Tab, Tabs } from "@heroui/react";
import { useState } from "react";

export default function User() {
    const [followed, setFollowed] = useState(false);
    return (
        <div className="bg-neutral-900 flex-1 w-full h-full rounded-2xl pb-14">
            <div className="min-h-[250px] bg-linear-to-t rounded-tl-2xl rounded-tr-2xl from-neutral-800 to-neutral-700 flex flex-row items-center flex-wrap pt-10 px-4 pb-14 lg:px-26 gap-10">
                <div className="w-[200px] h-[200px] rounded-full bg-neutral-900 flex items-center justify-center">
                    <Icon name="person" className="text-neutral-400" style={{ fontSize: 150 }} />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row flex-wrap  items-center gap-4">
                        <span className="text-2xl font-bold">Perfil</span>
                        <div className="flex flex-row flex-wrap gap-4">
                            <Chip variant="shadow" className="bg-black">
                                <span className="font-bold flex flex-row items-center uppercase">
                                    <Icon name="verified" style={{ fontSize: 20 }} />&nbsp;Dev
                                </span>
                            </Chip>
                            <Chip variant="shadow" color="warning">
                                <span className="font-bold flex flex-row items-center uppercase">
                                    <Icon name="verified" filled style={{ fontSize: 20 }} />&nbsp;Super xandão
                                </span>
                            </Chip>
                            <Chip variant="shadow" color="danger">
                                <span className="font-bold">Admin</span>
                            </Chip>
                            <span className="text-xl font-semibold flex flex-row items-center">
                                <img src={ImgBadgeCheckGold} width={20} alt="Artista verificado" />&nbsp;Artista
                            </span>
                            <span className="text-xl font-semibold flex flex-row items-center">
                                <img src={ImgBadgeCheckDefault} width={20} alt="Artista verificado" />&nbsp;Moderador
                            </span>
                        </div>
                    </div>
                    <h1 className="font-bold text-4xl sm:text-6xl lg:text-8xl line-clamp-1 mt-2">SamSepiol</h1>
                    <div className="flex flex-row flex-wrap gap-4">
                        <span className="text-lg">u/samsepiol</span>
                        <Button onPress={() => setFollowed(!followed)} color={followed ? "default" : "primary"} size="sm" radius="full">
                            {followed ? "Seguindo" : "Seguir"}
                        </Button>
                    </div>
                    <div className="flex flex-row flex-wrap gap-4 mt-2">
                        <div className="flex flex-row items-center gap-1">
                            <span className="text-sm font-normal">
                                <b className="font-bold">{0}</b> posts
                            </span>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <span className="text-sm font-normal">
                                <b className="font-bold">{0}</b> seguidores
                            </span>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <span className="text-sm font-normal">
                                <b className="font-bold">{0}</b> seguindo
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto flex justify-center sm:px-4 py-6">
                <Tabs aria-label="Options" color="default">
                    <Tab
                        key="musics"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Músicas</span>
                            </div>
                        }
                    />
                    <Tab
                        key="videos"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Videos</span>
                            </div>
                        }
                    />
                    <Tab
                        key="posts"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Posts</span>
                            </div>
                        }
                    />
                </Tabs>
            </div>
        </div>
    );
}