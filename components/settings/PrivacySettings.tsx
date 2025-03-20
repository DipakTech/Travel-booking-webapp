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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const privacyOptions = [
  "Show online status",
  "Allow others to find me by email",
  "Enable two-factor authentication",
];

export function PrivacySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy & Security</CardTitle>
        <CardDescription>Manage your privacy settings</CardDescription>
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
            {privacyOptions.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
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
  );
}
