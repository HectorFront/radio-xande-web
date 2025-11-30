import Lottie from "react-lottie";
import * as AnimationRecommended from "@/assets/animation_recommended.json";
import { Icon } from "@/components/Icon";

const animationData = JSON.parse(JSON.stringify(AnimationRecommended));

const defaultOptionsAnimation = {
    loop: true,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

const FEATURES_FREE = [
    "Escute a Rádio",
    "Veja vídeos publicados",
    "Sugira algo para a Democracia da Live",
    "Participe da Comunidade com ataques coordenados de PIX, histórias, comentários, memes, notícias e muito mais",
    "Veja vaquinhas ativas"
];

const FEATURES_SUBSCRIPTION = [
    "Ter um perfil de Artista oficial",
    "Publicar músicas de até 14MB",
    "Publicar vídeos de até 114MB",
    "Manter fixado sugestão para a Democracia da Live",
    "Também ajuda o Xandão e SamSepiol manter a plataforma online para todos",
    "Após 3 meses de assinatura, envie 5 gifs customizados e ganhe uma conta Premium no app Mexpenses"
];

export default function Subscriptions() {
    return (
        <div className="bg-neutral-950 flex flex-col gap-5 flex-1 w-full h-full rounded-2xl pt-10 px-4 pb-14 lg:px-26">
            <div className="w-full grid relative items-start gap-10 border border-neutral-800 rounded-2xl p-8 bg-neutral-900">
                <div className="absolute -right-15 -top-10">
                    <Lottie
                        width={120}
                        height={120}
                        isClickToPauseDisabled
                        options={{
                            ...defaultOptionsAnimation,
                            animationData: animationData
                        }}
                    />
                </div>
                <div className="grid gap-6">
                    <h3 className="text-3xl font-bold text-blue-400">É Blue!</h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        {FEATURES_SUBSCRIPTION.map((item) => (
                            <li key={item} className="flex items-center text-zinc-300">
                                <Icon name="check" className="text-blue-400 mr-2 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col gap-4 text-center">
                    <div className="flex flex-row items-end justify-center gap-2">
                        <h4 className="text-4xl whitespace-nowrap font-bold text-blue-400">R$ 24,99</h4>
                        <span className="text-lg text-zinc-400 font-bold">/ Mês</span>
                    </div>
                    <a href="#" className="block">
                        <button className="w-full h-14 cursor-pointer px-6 py-2 rounded-full border border-blue-400 text-blue-400 hover:text-white hover:border-blue-500 hover:bg-blue-500 transition">
                            <span className="block text-xl font-bold">Começar agora</span>
                        </button>
                    </a>
                </div>
            </div>
            <div className="w-full grid relative items-start gap-10 border border-neutral-800 rounded-2xl p-8 bg-neutral-900">
                <div className="grid gap-6">
                    <h3 className="text-2xl">Gratuito</h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        {FEATURES_FREE.map((item) => (
                            <li key={item} className="flex items-center text-zinc-400">
                                <Icon name="check" className="text-white mr-2 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}