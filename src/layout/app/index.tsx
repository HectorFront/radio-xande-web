import Header from "./header";
import BannerHeader from "@/assets/banner_header.jpg";
import IconYouTube from "@/assets/icon_youtube.png";

export const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex flex-col relative">
        <Header />
        <div className="xs:hidden flex bg-neutral-900 flex-row gap-4 items-center justify-center absolute p-4 left-5 bottom-7 rounded-xl">
          <div className="bg-white text-neutral-950 px-4 rounded font-bold text-xs sm:text-sm">
            Offline
          </div>
          <span className="font-bold flex flex-row items-center gap-2 text-xs sm:text-sm">
            Xandinho está off-line
            <img src={IconYouTube} width={20} alt="YouTube"/>
          </span>
        </div>
        <div className="h-30 bg-center bg-cover w-full" style={{ backgroundImage: `url(${BannerHeader})` }}/>
      </div>
      <main className="p-4 flex-1">
        {children}
      </main>
    </>
  );
}