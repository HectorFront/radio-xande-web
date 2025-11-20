import React from "react";
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
} from "@heroui/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    "Rádio",
    "Xanvídeos",
    "Link para live (Já vejo já irmão)",
    "Postagens da comunidade"
  ];

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} maxWidth="2xl">
      <NavbarContent className="lg:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>
      <NavbarContent className="lg:hidden pr-3" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">StompeBob MIX</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden lg:flex gap-10" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit text-xl">StompeBob Mix</p>
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" href="#">
            Rádio
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Xanvídeos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Link para live&nbsp;<b>Já vejo já irmão</b>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Postagens da comunidade
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Link color="foreground" href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="danger" href="#" variant="flat">
            Criar conta
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={"foreground"}
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}