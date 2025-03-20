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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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

  // Example notifications - in a real app, these would come from an API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New booking confirmed",
      description:
        "Everest Base Camp trek has been confirmed for October 15, 2023. 6 participants are confirmed.",
      time: "2 minutes ago",
      date: "Today",
      read: false,
      type: "success",
      actionUrl: "/dashboard/bookings/B1234",
      actionLabel: "View Booking",
      relatedEntity: {
        type: "booking",
        id: "B1234",
        name: "Everest Base Camp",
      },
    },
    {
      id: "2",
      title: "Guide schedule updated",
      description:
        "Tenzing Sherpa has a new tour assigned: Annapurna Circuit (Nov 10-25, 2023)",
      time: "3 hours ago",
      date: "Today",
      read: false,
      type: "info",
      actionUrl: "/dashboard/guides/G001/schedule",
      actionLabel: "View Schedule",
      relatedEntity: {
        type: "guide",
        id: "G001",
        name: "Tenzing Sherpa",
      },
    },
    {
      id: "3",
      title: "Tour cancelation request",
      description:
        "Customer Maria Johnson requested to cancel Annapurna trek scheduled for Dec 5, 2023",
      time: "1 day ago",
      date: "Yesterday",
      read: true,
      type: "warning",
      actionUrl: "/dashboard/bookings/B1235/cancel",
      actionLabel: "Process Cancellation",
      relatedEntity: {
        type: "booking",
        id: "B1235",
        name: "Annapurna Circuit",
      },
    },
    {
      id: "4",
      title: "Payment failed",
      description:
        "Payment for booking #B1236 (Langtang Valley) failed due to insufficient funds",
      time: "2 days ago",
      date: "May 15, 2023",
      read: true,
      type: "error",
      actionUrl: "/dashboard/bookings/B1236/payment",
      actionLabel: "Review Payment",
      relatedEntity: {
        type: "booking",
        id: "B1236",
        name: "Langtang Valley",
      },
    },
    {
      id: "5",
      title: "New customer review",
      description:
        "Jenny Parker left a 5-star review for the Everest Base Camp trek with guide Tenzing Sherpa",
      time: "3 days ago",
      date: "May 14, 2023",
      read: true,
      type: "success",
      actionUrl: "/dashboard/reviews",
      actionLabel: "View Review",
    },
    {
      id: "6",
      title: "System maintenance completed",
      description:
        "The scheduled system maintenance has been completed successfully. All systems are operational.",
      time: "5 days ago",
      date: "May 12, 2023",
      read: true,
      type: "info",
    },
  ]);

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter notifications based on current tab and search query
  const filteredNotifications = notifications.filter((notification) => {
    // First apply tab filter
    if (currentTab === "unread" && notification.read) return false;
    if (currentTab === "read" && !notification.read) return false;

    // Then apply type filter if not "all"
    if (filterType !== "all" && notification.type !== filterType) return false;

    // Finally apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.description.toLowerCase().includes(query) ||
        notification.relatedEntity?.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Group notifications by date
  const groupedNotifications: Record<string, Notification[]> = {};
  filteredNotifications.forEach((notification) => {
    if (!groupedNotifications[notification.date]) {
      groupedNotifications[notification.date] = [];
    }
    groupedNotifications[notification.date].push(notification);
  });

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
    // Remove from selected if it was selected
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications((prev) => prev.filter((nId) => nId !== id));
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
    setSelectedNotifications([]);
  };

  // Mark selected notifications as read
  const markSelectedAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) =>
        selectedNotifications.includes(notification.id)
          ? { ...notification, read: true }
          : notification,
      ),
    );
    setSelectedNotifications([]);
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
    // Remove from selected if it was selected
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications((prev) => prev.filter((nId) => nId !== id));
    }
  };

  // Delete selected notifications
  const deleteSelected = () => {
    setNotifications((prev) =>
      prev.filter(
        (notification) => !selectedNotifications.includes(notification.id),
      ),
    );
    setSelectedNotifications([]);
  };

  // Toggle selection of a notification
  const toggleSelect = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id],
    );
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
  const unreadCount = notifications.filter((n) => !n.read).length;

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
                onClick={markSelectedAsRead}
                disabled={selectedNotifications.every(
                  (id) => notifications.find((n) => n.id === id)?.read,
                )}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark as Read
              </Button>
              <Button variant="outline" size="sm" onClick={deleteSelected}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
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
                                      {notification.time}
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
                                        markAsRead(notification.id)
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
                                      deleteNotification(notification.id)
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
                                      {notification.time}
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
                                    onClick={() => markAsRead(notification.id)}
                                    title="Mark as read"
                                  >
                                    <CheckCheck className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      deleteNotification(notification.id)
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
                                      {notification.time}
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
                                      deleteNotification(notification.id)
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
