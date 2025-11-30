import { Icon, Render } from "@/components";
import ImgBadgeCheckDefault from "@/assets/badge-check.png";
import ImgBadgeCheckGold from "@/assets/badge-check-gold.png";
import { AvatarIcon, Button, Chip, Tab, Tabs } from "@heroui/react";
import { useContext, useState } from "react";
import { ContextAuthentication } from "@/contexts/Authentication";

export default function User() {
    const { user } = useContext(ContextAuthentication);
    const [followed, setFollowed] = useState(false);
    return (
        <div className="bg-neutral-900 flex-1 w-full h-full rounded-2xl pb-14">
            <div className="min-h-[250px] bg-linear-to-t rounded-tl-2xl rounded-tr-2xl from-neutral-800 to-neutral-700 flex flex-row items-center flex-wrap pt-10 px-4 pb-14 lg:px-26 gap-10">
                <div className="w-[200px] h-[200px] rounded-full bg-linear-to-br from-[#FFB457] to-[#FF705B] text-black/80 flex items-center justify-center">
                    <Render test={!user.picture}>
                        <AvatarIcon/>
                    </Render>
                    <Render test={user.picture}>
                        <img src={user.picture} className="w-full h-full rounded-full" alt="Foto de perfil" />
                    </Render>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row flex-wrap  items-center gap-4">
                        <span className="text-2xl font-bold">Perfil</span>
                        <div className="flex flex-row flex-wrap gap-4">
                            <Render test={user.is_dev}>
                                <Chip variant="shadow" className="bg-black">
                                    <span className="font-bold flex flex-row items-center uppercase">
                                        <Icon name="terminal" style={{ fontSize: 20 }} />&nbsp;Dev oficial
                                    </span>
                                </Chip>
                            </Render>
                            <Render test={user.is_superxandao}>
                                <Chip variant="shadow" color="warning">
                                    <span className="font-bold flex flex-row items-center uppercase">
                                        <Icon name="verified" filled style={{ fontSize: 20 }} />&nbsp;Super xandão
                                    </span>
                                </Chip>
                            </Render>
                            <Render test={user.is_admin}>
                                <Chip variant="shadow" color="danger">
                                    <span className="font-bold flex flex-row items-center uppercase">
                                        <Icon name="security" style={{ fontSize: 20 }} />&nbsp;Admin
                                    </span>
                                </Chip>
                            </Render>
                            <Render test={user.is_artist}>
                                <span className="text-xl font-semibold flex flex-row items-center">
                                    <img src={ImgBadgeCheckGold} width={20} alt="Artista verificado" />&nbsp;Artista
                                </span>
                            </Render>
                            <Render test={user.is_moderator}>
                                <span className="text-xl font-semibold flex flex-row items-center">
                                    <img src={ImgBadgeCheckDefault} width={20} alt="Moderador verificado" />&nbsp;Moderador
                                </span>
                            </Render>
                        </div>
                    </div>
                    <h1 className="font-bold text-4xl sm:text-6xl lg:text-8xl line-clamp-1 mt-2">{user.name}</h1>
                    <div className="flex flex-row flex-wrap gap-4">
                        <span className="text-lg">u/{user.username}</span>
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