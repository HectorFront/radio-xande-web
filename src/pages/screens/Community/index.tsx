import { Input, Select, SelectItem, Tab, Tabs } from '@heroui/react';
import PostList from './components/PostList';
import Sidebar from './components/Sidebar';
import { Icon } from '@/components';

export default function Community() {

    const ORDER_BY = [
        {key: "new", label: "Mais novos"},
        {key: "most_voted", label: "Mais votados"},
        {key: "most_commented", label: "Mais comentados"},
        {key: "most_bad", label: "Menos votados"},
    ];

    return (
        <div className="bg-neutral-900 flex-1 w-full h-auto rounded-2xl pt-10 px-4 pb-14 lg:px-26">
            <div className="max-w-7xl mx-auto sm:px-4 py-6">
                <div className="flex flex-row flex-wrap gap-6">
                    <Sidebar />
                    <div className="flex-1 max-w-4xl">
                        <div className='flex flex-row items-end flex-wrap justify-between mb-5 gap-4'>
                            <Select
                                size="sm"
                                color="default"
                                label="Ordenar por"
                                defaultSelectedKeys={["new"]}
                                className="w-[165px] max-w-full"
                                placeholder="Selecione uma opção"
                                >
                                {ORDER_BY.map((option) => (
                                    <SelectItem key={option.key}>{option.label}</SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='flex flex-col-reverse lg:flex-row items-end gap-4 flex-1 mb-5'>
                                <Input
                                    radius="lg"
                                    isClearable
                                    className="flex-1"
                                    placeholder="Buscar Publicações"
                                    startContent={
                                    <Icon name="search" style={{ fontSize: 22 }} />
                                    }
                                />
                                <Tabs aria-label="Options" color="default">
                                    <Tab
                                        key="photos"
                                        title={
                                            <div className="flex items-center space-x-2">
                                                <span>Genérico</span>
                                            </div>
                                        }
                                    />
                                    <Tab
                                        key="music"
                                        title={
                                            <div className="flex items-center space-x-2">
                                                <span>Meme</span>
                                            </div>
                                        }
                                    />
                                    <Tab
                                        key="videos"
                                        title={
                                            <div className="flex items-center space-x-2">
                                                <span>Notícias</span>
                                            </div>
                                        }
                                    />
                                </Tabs>
                            </div>
                        <PostList />
                    </div>
                </div>
            </div>
        </div>
    );
}