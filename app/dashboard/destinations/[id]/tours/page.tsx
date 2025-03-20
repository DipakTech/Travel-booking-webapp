import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  Check,
  Clock,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const metadata: Metadata = {
  title: "Destination Tours | Travel Booking Dashboard",
  description: "Manage tours for a specific destination",
};

// Mock data - in a real app, this would come from a database
const destinations = [
  {
    id: "D001",
    name: "Everest Base Camp",
    location: "Khumbu Region, Nepal",
  },
];

const tours = [
  {
    id: "T001",
    destinationId: "D001",
    name: "Everest Base Camp Classic Trek",
    startDate: "2023-10-15",
    endDate: "2023-10-28",
    duration: "14 days",
    maxTravelers: 12,
    currentBookings: 8,
    price: 1600,
    status: "upcoming",
    guide: "Tenzing Sherpa",
  },
  {
    id: "T002",
    destinationId: "D001",
    name: "Everest Base Camp with Island Peak",
    startDate: "2023-11-05",
    endDate: "2023-11-22",
    duration: "18 days",
    maxTravelers: 8,
    currentBookings: 6,
    price: 2200,
    status: "upcoming",
    guide: "Mingma Dorje",
  },
  {
    id: "T003",
    destinationId: "D001",
    name: "Everest Base Camp Express",
    startDate: "2023-09-10",
    endDate: "2023-09-21",
    duration: "12 days",
    maxTravelers: 10,
    currentBookings: 10,
    price: 1450,
    status: "completed",
    guide: "Pasang Lhamu",
  },
  {
    id: "T004",
    destinationId: "D001",
    name: "Everest Three Passes Trek",
    startDate: "2023-12-05",
    endDate: "2023-12-24",
    duration: "20 days",
    maxTravelers: 8,
    currentBookings: 4,
    price: 2400,
    status: "upcoming",
    guide: "Pemba Gyaltsen",
  },
];

export default function DestinationToursPage({
  params,
}: {
  params: { id: string };
}) {
  const destination = destinations.find((d) => d.id === params.id);

  if (!destination) {
    notFound();
  }

  const destinationTours = tours.filter(
    (tour) => tour.destinationId === params.id,
  );

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Upcoming
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/destinations/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              {destination.name} Tours
            </h2>
          </div>
          <p className="text-muted-foreground">
            Manage tours for {destination.location}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Tour
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{destinationTours.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Tours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                destinationTours.filter((tour) => tour.status === "upcoming")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Next 3 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Booked Travelers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {destinationTours.reduce(
                (total, tour) => total + tour.currentBookings,
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Across all tours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Capacity Filled
            </CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (destinationTours.reduce(
                  (total, tour) => total + tour.currentBookings,
                  0,
                ) /
                  destinationTours.reduce(
                    (total, tour) => total + tour.maxTravelers,
                    0,
                  )) *
                  100,
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Total capacity utilization
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Input placeholder="Search tours..." className="pl-8" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tour Name</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Guide</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {destinationTours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell className="font-medium">{tour.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {formatDate(tour.startDate)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      to {formatDate(tour.endDate)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {tour.duration}
                  </div>
                </TableCell>
                <TableCell>{tour.guide}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {tour.currentBookings}/{tour.maxTravelers}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />$
                    {tour.price}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(tour.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Tour</DropdownMenuItem>
                      <DropdownMenuItem>Manage Bookings</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Cancel Tour
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
