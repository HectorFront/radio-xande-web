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
import SpongebobJSON from '@/assets/spongebob.json';
import { CLIENT_ROUTES } from "@/domain/client/routes";
import clsx from "clsx";
import { ModalLogin } from "@/components";

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
  const [modalLoginOpen, setModalLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { text: "Rádio", path: CLIENT_ROUTES.Radio },
    { text: "Vídeos", path: CLIENT_ROUTES.Xanvideos },
    { text: "Democracia da Live", path: CLIENT_ROUTES.Links },
    { text: "Comunidade", path: CLIENT_ROUTES.Community },
    { text: "Assinaturas", path: CLIENT_ROUTES.Subscriptions },
  ];

  return (
    <>
      <ModalLogin 
        open={modalLoginOpen}
        onClose={() => setModalLoginOpen(false)}
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
              options={{ ...defaultOptionsLottie, animationData: SpongebobJSON }}
            />
            <div className="flex flex-row items-center gap-2">
              <p className="font-bold text-inherit text-xs sm:text-lg">StompeBob MIX</p>
              <Chip color="primary" size="sm">Beta</Chip>
            </div>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden lg:flex gap-10" justify="center">
          <NavbarBrand className="flex flex-row items-center">
            <Lottie
              width={50}
              height={50}
              isClickToPauseDisabled
              options={{ ...defaultOptionsLottie, animationData: SpongebobJSON }}
            />
            <div className="flex flex-row items-center gap-2">
              <p className="font-bold text-inherit text-xl">StompeBob MIX</p>
              <Chip color="primary" size="sm">Beta</Chip>
            </div>
          </NavbarBrand>
          <NavbarItem isActive={location.pathname === CLIENT_ROUTES.Radio}>
            <Link className="cursor-pointer hover:opacity-80" color={"foreground"} onClick={() => navigate(CLIENT_ROUTES.Radio)}>
              Rádio
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === CLIENT_ROUTES.Xanvideos}>
            <Link className="cursor-pointer hover:opacity-80" color="foreground" onClick={() => navigate(CLIENT_ROUTES.Xanvideos)}>
              Vídeos
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === CLIENT_ROUTES.Links}>
            <Link className="cursor-pointer hover:opacity-80" color="foreground">
              Democracia da Live
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === CLIENT_ROUTES.Community}>
            <Link className="cursor-pointer hover:opacity-80" color="foreground">
              Comunidade
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === CLIENT_ROUTES.Subscriptions}>
            <Link className="cursor-pointer hover:opacity-80" color="foreground">
              Assinaturas
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Link onPress={() => setModalLoginOpen(true)} color="foreground" className="cursor-pointer">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="danger" variant="flat">
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
                className="w-full cursor-pointer hover:opacity-80"
              >
                <span className={clsx({ "border-b-4 border-b-red-400 font-bold": location.pathname === path })} dangerouslySetInnerHTML={{ __html: text }} />
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </>
  );
}