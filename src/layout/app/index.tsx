import Header from "./header";
import { ContainerStream } from "./stream/container";
import { PlayerDrawerProvider } from "@/contexts/PlayerDrawer";

export const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <PlayerDrawerProvider>
      <div className="flex flex-col relative">
        <Header />
        <ContainerStream />
      </div>
      <main className="p-4 flex-1 pb-34">
        {children}
      </main>
    </PlayerDrawerProvider>
  );
}