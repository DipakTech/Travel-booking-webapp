"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  X,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  CheckCheck,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/lib/hooks/use-notifications";
import { useMarkNotificationAsRead } from "@/lib/hooks/use-notifications";
import { useDeleteNotification } from "@/lib/hooks/use-notifications";
import { useMarkAllNotificationsAsRead } from "@/lib/hooks/use-notifications";
import { useMarkNotificationsAsRead } from "@/lib/hooks/use-notifications";
import { useDeleteNotifications } from "@/lib/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
  actionUrl?: string;
  actionLabel?: string;
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    [],
  );

  const { data: notificationsData, isLoading } = useNotifications({
    type: filterType === "all" ? undefined : filterType,
    status:
      currentTab === "all"
        ? "all"
        : currentTab === "unread"
        ? "unread"
        : "read",
    search: searchQuery || undefined,
  });

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: markSelectedAsRead } = useMarkNotificationsAsRead();
  const { mutate: deleteSelected } = useDeleteNotifications();

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  // Show loading state while checking authentication
  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter notifications based on current tab and search query
  const filteredNotifications = notificationsData?.notifications || [];

  // Group notifications by date
  const groupedNotifications: Record<string, Notification[]> = {};
  filteredNotifications.forEach((notification) => {
    if (!groupedNotifications[notification.date]) {
      groupedNotifications[notification.date] = [];
    }
    groupedNotifications[notification.date].push(notification);
  });

  // Mark a notification as read
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications((prev) => prev.filter((nId) => nId !== id));
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    // Implementation of handleMarkAllAsRead
  };

  // Mark selected notifications as read
  const handleMarkSelectedAsRead = () => {
    markSelectedAsRead(selectedNotifications);
    setSelectedNotifications([]);
  };

  // Delete notification
  const handleDeleteNotification = (id: string) => {
    // Implementation of handleDeleteNotification
  };

  // Delete selected notifications
  const handleDeleteSelected = () => {
    deleteSelected(selectedNotifications);
    setSelectedNotifications([]);
  };

  // Toggle selection of a notification
  const toggleSelect = (id: string) => {
    // Implementation of toggleSelect
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Get the count of unread notifications
  const unreadCount =
    notificationsData?.notifications.filter((n) => !n.read).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and view all your notifications
            {unreadCount > 0 && ` (${unreadCount} unread)`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedNotifications.length > 0 ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkSelectedAsRead}
                disabled={selectedNotifications.every(
                  (id) =>
                    notificationsData?.notifications.find((n) => n.id === id)
                      ?.read,
                )}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark as Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark All as Read
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => setFilterType("all")}
                    className="cursor-pointer"
                  >
                    <span>All Types</span>
                    {filterType === "all" && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterType("info")}
                    className="cursor-pointer"
                  >
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Information</span>
                    {filterType === "info" && (
                      <Check className="h-4 w-4 ml-2" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterType("success")}
                    className="cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span>Success</span>
                    {filterType === "success" && (
                      <Check className="h-4 w-4 ml-2" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterType("warning")}
                    className="cursor-pointer"
                  >
                    <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>Warning</span>
                    {filterType === "warning" && (
                      <Check className="h-4 w-4 ml-2" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterType("error")}
                    className="cursor-pointer"
                  >
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    <span>Error</span>
                    {filterType === "error" && (
                      <Check className="h-4 w-4 ml-2" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notifications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={currentTab}
        onValueChange={setCurrentTab}
        className="w-full"
      >
        <TabsList className="w-full sm:w-auto grid grid-cols-3 h-auto">
          <TabsTrigger value="all" className="py-2">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="py-2">
            Unread{" "}
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-primary text-white" variant="secondary">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read" className="py-2">
            Read
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg font-medium">
                All Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {Object.keys(groupedNotifications).length > 0 ? (
                Object.entries(groupedNotifications).map(
                  ([date, notifications], index) => (
                    <div key={date}>
                      <div className="px-4 py-2 bg-muted/30">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {date}
                        </h3>
                      </div>
                      <div>
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-4 flex items-start gap-3 ${
                              !notification.read ? "bg-muted/20" : ""
                            } border-b last:border-0 hover:bg-muted/10 transition-colors`}
                          >
                            <div className="flex items-center h-5 pt-0.5">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={selectedNotifications.includes(
                                  notification.id,
                                )}
                                onChange={() => toggleSelect(notification.id)}
                              />
                            </div>
                            <div className="pt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium text-sm">
                                    {notification.title}
                                    {!notification.read && (
                                      <span className="inline-block w-2 h-2 rounded-full bg-primary ml-2"></span>
                                    )}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                                    {notification.description}
                                  </p>
                                  {notification.relatedEntity && (
                                    <div className="mb-2">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {notification.relatedEntity.type}:{" "}
                                        {notification.relatedEntity.name}
                                      </Badge>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3">
                                    <p className="text-xs text-muted-foreground flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatDistanceToNow(
                                        new Date(notification.createdAt),
                                        { addSuffix: true },
                                      )}
                                    </p>
                                    {notification.actionUrl && (
                                      <Button
                                        variant="link"
                                        asChild
                                        className="h-auto p-0 text-xs"
                                      >
                                        <a href={notification.actionUrl}>
                                          {notification.actionLabel ||
                                            "View Details"}
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() =>
                                        handleMarkAsRead(notification.id)
                                      }
                                      title="Mark as read"
                                    >
                                      <CheckCheck className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      handleDeleteNotification(notification.id)
                                    }
                                    title="Delete notification"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    No notifications found
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery
                      ? "Try a different search term"
                      : "You're all caught up!"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg font-medium">
                Unread Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {Object.keys(groupedNotifications).length > 0 ? (
                Object.entries(groupedNotifications).map(
                  ([date, notifications], index) => (
                    <div key={date}>
                      <div className="px-4 py-2 bg-muted/30">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {date}
                        </h3>
                      </div>
                      <div>
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-4 flex items-start gap-3 border-b last:border-0 hover:bg-muted/10 transition-colors"
                          >
                            <div className="flex items-center h-5 pt-0.5">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={selectedNotifications.includes(
                                  notification.id,
                                )}
                                onChange={() => toggleSelect(notification.id)}
                              />
                            </div>
                            <div className="pt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium text-sm">
                                    {notification.title}
                                    <span className="inline-block w-2 h-2 rounded-full bg-primary ml-2"></span>
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                                    {notification.description}
                                  </p>
                                  {notification.relatedEntity && (
                                    <div className="mb-2">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {notification.relatedEntity.type}:{" "}
                                        {notification.relatedEntity.name}
                                      </Badge>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3">
                                    <p className="text-xs text-muted-foreground flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatDistanceToNow(
                                        new Date(notification.createdAt),
                                        { addSuffix: true },
                                      )}
                                    </p>
                                    {notification.actionUrl && (
                                      <Button
                                        variant="link"
                                        asChild
                                        className="h-auto p-0 text-xs"
                                      >
                                        <a href={notification.actionUrl}>
                                          {notification.actionLabel ||
                                            "View Details"}
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      handleMarkAsRead(notification.id)
                                    }
                                    title="Mark as read"
                                  >
                                    <CheckCheck className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      handleDeleteNotification(notification.id)
                                    }
                                    title="Delete notification"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    No unread notifications
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You&apos;ve read all your notifications
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="read" className="mt-6">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg font-medium">
                Read Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {Object.keys(groupedNotifications).length > 0 ? (
                Object.entries(groupedNotifications).map(
                  ([date, notifications], index) => (
                    <div key={date}>
                      <div className="px-4 py-2 bg-muted/30">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {date}
                        </h3>
                      </div>
                      <div>
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-4 flex items-start gap-3 border-b last:border-0 hover:bg-muted/10 transition-colors"
                          >
                            <div className="flex items-center h-5 pt-0.5">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={selectedNotifications.includes(
                                  notification.id,
                                )}
                                onChange={() => toggleSelect(notification.id)}
                              />
                            </div>
                            <div className="pt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium text-sm">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                                    {notification.description}
                                  </p>
                                  {notification.relatedEntity && (
                                    <div className="mb-2">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {notification.relatedEntity.type}:{" "}
                                        {notification.relatedEntity.name}
                                      </Badge>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3">
                                    <p className="text-xs text-muted-foreground flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatDistanceToNow(
                                        new Date(notification.createdAt),
                                        { addSuffix: true },
                                      )}
                                    </p>
                                    {notification.actionUrl && (
                                      <Button
                                        variant="link"
                                        asChild
                                        className="h-auto p-0 text-xs"
                                      >
                                        <a href={notification.actionUrl}>
                                          {notification.actionLabel ||
                                            "View Details"}
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      handleDeleteNotification(notification.id)
                                    }
                                    title="Delete notification"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No read notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You have no previously read notifications
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
