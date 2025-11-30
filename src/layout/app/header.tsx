import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Chip
} from "@heroui/react";
import Lottie from 'react-lottie';
import { useLocation, useNavigate } from "react-router-dom";
import LogoBarsJSON from '@/assets/logo_bars.json';
import { CLIENT_ROUTES } from "@/domain/client/routes";
import clsx from "clsx";
import { ModalLogin } from "@/components";
import { ModalRegister } from "@/components/ModalRegister";

export const defaultOptionsLottie = {
  loop: true,
  autoplay: true,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalLoginOpen, setModalLoginOpen] = useState(false);
  const [modalRegisterOpen, setModalRegisterOpen] = useState(false);

  const menuItems = [
    { text: "Rádio", path: CLIENT_ROUTES.Radio },
    { text: "Vídeos", path: CLIENT_ROUTES.Xanvideos },
    { text: "Democracia da Live", path: CLIENT_ROUTES.Links },
    { text: "Comunidade", path: CLIENT_ROUTES.Community },
    { text: "Vaquinhas ❤️‍🩹", path: CLIENT_ROUTES.Donations },
    { text: "Seja membro", path: CLIENT_ROUTES.Subscriptions },
  ];

  return (
    <>
      <ModalLogin 
        open={modalLoginOpen}
        onClose={() => setModalLoginOpen(false)}
      />
      <ModalRegister
        open={modalRegisterOpen}
        onClose={() => setModalRegisterOpen(false)}
      />
      <Navbar
        isBordered
        maxWidth="2xl"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        classNames={{
          item: [
            "flex",
            "relative",
            "h-full",
            "items-center",
            "data-[active=true]:after:content-['']",
            "data-[active=true]:after:absolute",
            "data-[active=true]:after:bottom-0",
            "data-[active=true]:after:left-0",
            "data-[active=true]:after:right-0",
            "data-[active=true]:after:h-[4px]",
            "data-[active=true]:after:rounded-[2px]",
            "data-[active=true]:after:bg-danger",
          ],
        }}
      >
        <NavbarContent className="lg:hidden" justify="start">
          <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        </NavbarContent>
        <NavbarContent className="lg:hidden pr-3" justify="center">
          <NavbarBrand className="flex flex-row items-center">
            <Lottie
              width={30}
              height={30}
              isClickToPauseDisabled
              options={{ ...defaultOptionsLottie, animationData: LogoBarsJSON }}
            />
            <div className="flex flex-row items-center gap-2">
              <p className="font-bold text-inherit text-xs sm:text-lg">StompeMIX</p>
              <Chip size="sm" color="primary">Beta</Chip>
            </div>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden lg:flex gap-10" justify="center">
          <NavbarBrand className="flex flex-row items-center">
            <Lottie
              width={50}
              height={50}
              isClickToPauseDisabled
              options={{ ...defaultOptionsLottie, animationData: LogoBarsJSON }}
            />
            <div className="flex flex-row items-center gap-2">
              <p className="font-bold text-inherit text-xl">StompeMIX</p>
              <Chip size="sm" color="primary">Beta</Chip>
            </div>
          </NavbarBrand>
          <NavbarItem isActive={location.pathname === CLIENT_ROUTES.Radio}>
            <Link className="font-semibold cursor-pointer hover:opacity-80" color={"foreground"} onClick={() => navigate(CLIENT_ROUTES.Radio)}>
              Rádio
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === CLIENT_ROUTES.Xanvideos}>
            <Link className="font-semibold cursor-pointer hover:opacity-80" color="foreground" onClick={() => navigate(CLIENT_ROUTES.Xanvideos)}>
              Vídeos
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === CLIENT_ROUTES.Links}>
            <Link className="font-semibold cursor-pointer hover:opacity-80" color="foreground" onClick={() => navigate(CLIENT_ROUTES.Links)}>
              Democracia da Live
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === CLIENT_ROUTES.Community}>
            <Link className="font-semibold cursor-pointer hover:opacity-80" color="foreground" onClick={() => navigate(CLIENT_ROUTES.Community)}>
              Comunidade
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === CLIENT_ROUTES.Donations}>
            <Link className="font-semibold cursor-pointer hover:opacity-80" color="foreground" onClick={() => navigate(CLIENT_ROUTES.Donations)}>
              Vaquinhas ❤️‍🩹
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === CLIENT_ROUTES.Subscriptions}>
            <Link className="font-semibold cursor-pointer hover:opacity-80" color="foreground" onClick={() => navigate(CLIENT_ROUTES.Subscriptions)}>
              Seja membro
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Link onPress={() => setModalLoginOpen(true)} color="foreground" className="cursor-pointer font-semibold">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button className="font-semibold" onPress={() => setModalRegisterOpen(true)} as={Link} color="danger" variant="flat">
              Criar conta
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map(({ text, path }, index) => (
            <NavbarMenuItem key={`link-${index}`}>
              <Link
                size="lg"
                color="foreground"
                onClick={() => navigate(path)}
                className="w-full cursor-pointer hover:opacity-80"
              >
                <span className={clsx({ "border-b-4 border-b-red-400 font-semibold": location.pathname === path })} dangerouslySetInnerHTML={{ __html: text }} />
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </>
  );
}