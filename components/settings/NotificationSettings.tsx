"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const notificationOptions = [
  "Email notifications for new messages",
  "Push notifications for tour updates",
  "Weekly newsletter",
  "Tour booking confirmations",
  "Special offers and promotions",
];

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose what notifications you receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {notificationOptions.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
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
  );
}
