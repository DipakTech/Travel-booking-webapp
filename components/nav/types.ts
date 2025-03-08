import { LucideIcon } from "lucide-react";

export interface Route {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavbarProps {
  routes: Route[];
}

export interface UserMenuProps {
  session: any;
  status: string;
  onSignOut: () => void;
}

export interface MobileMenuProps extends NavbarProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  onSignOut: () => void;
}

export interface DesktopMenuProps extends NavbarProps {
  pathname: string;
}
