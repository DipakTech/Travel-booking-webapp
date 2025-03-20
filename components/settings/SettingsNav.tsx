"use client";

import { Card, CardContent } from "@/components/ui/card";
import { User, Bell, Shield, Palette, Globe, Wallet } from "lucide-react";

export const settingsSections = [
  {
    id: "account",
    label: "Account Settings",
    icon: User,
    description: "Manage your account information and preferences",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Choose what notifications you want to receive",
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: Shield,
    description: "Control your privacy and security settings",
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    description: "Customize how Guide Connect looks on your device",
  },
  {
    id: "language",
    label: "Language & Region",
    icon: Globe,
    description: "Set your language and regional preferences",
  },
  {
    id: "payment",
    label: "Payment Methods",
    icon: Wallet,
    description: "Manage your payment methods and billing",
  },
];

interface SettingsNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function SettingsNav({
  activeSection,
  onSectionChange,
}: SettingsNavProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <nav className="space-y-1">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeSection === section.id
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <section.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
