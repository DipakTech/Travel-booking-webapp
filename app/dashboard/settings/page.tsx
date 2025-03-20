"use client";

import { useSession } from "next-auth/react";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { useState } from "react";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { LanguageSettings } from "@/components/settings/LanguageSettings";
import { PaymentSettings } from "@/components/settings/PaymentSettings";

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

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings session={session} />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return <PrivacySettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "language":
        return <LanguageSettings />;
      case "payment":
        return <PaymentSettings />;
      default:
        return null;
    }
  };

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
            <SettingsNav
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </motion.div>

          {/* Settings Content */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-3/4 space-y-6"
          >
            {renderSettingsContent()}
          </motion.div>
        </div>
      </motion.div>
    </Container>
  );
}
