"use client";

import { useSession } from "next-auth/react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Globe,
  Lock,
  Mail,
  Moon,
  Palette,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const settingsSections = [
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

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("account");

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to view settings.</p>
      </div>
    );
  }

  return (
    <Container className="py-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="mt-10 flex flex-col lg:flex-row gap-8">
          {/* Settings Navigation */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/4">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {settingsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <section.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {section.label}
                      </span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-3/4 space-y-6"
          >
            {/* Account Settings */}
            {activeSection === "account" && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue={session.user.name || ""} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={session.user.email || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+977 98XXXXXXXX"
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what notifications you receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      "Email notifications for new messages",
                      "Push notifications for tour updates",
                      "Weekly newsletter",
                      "Tour booking confirmations",
                      "Special offers and promotions",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <Label>{item}</Label>
                          <p className="text-sm text-gray-500">
                            Receive notifications about {item.toLowerCase()}
                          </p>
                        </div>
                        <Switch />
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy & Security */}
            {activeSection === "privacy" && (
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>
                    Manage your privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Profile Visibility</Label>
                      <Select defaultValue="public">
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      {[
                        "Show online status",
                        "Allow others to find me by email",
                        "Enable two-factor authentication",
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <Label>{item}</Label>
                          <Switch />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button>Update Security Settings</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Appearance */}
            {activeSection === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize your viewing experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Theme</Label>
                      <Select defaultValue="system">
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Font Size</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Language & Region */}
            {activeSection === "language" && (
              <Card>
                <CardHeader>
                  <CardTitle>Language & Region</CardTitle>
                  <CardDescription>
                    Set your language and regional preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ne">नेपाली</SelectItem>
                          <SelectItem value="hi">हिंदी</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Time Zone</Label>
                      <Select defaultValue="np">
                        <SelectTrigger>
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="np">Nepal (GMT+5:45)</SelectItem>
                          <SelectItem value="in">India (GMT+5:30)</SelectItem>
                          <SelectItem value="us">
                            United States (GMT-4)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Methods */}
            {activeSection === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Default Payment Method</Label>
                      <Select defaultValue="card">
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">
                            Credit/Debit Card
                          </SelectItem>
                          <SelectItem value="esewa">eSewa</SelectItem>
                          <SelectItem value="khalti">Khalti</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" className="w-full">
                      Add New Payment Method
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </motion.div>
    </Container>
  );
}
