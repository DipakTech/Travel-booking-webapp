import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Star, MapPin, Users, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Destination {
  id: string;
  name: string;
  location: string;
  rating: number;
  visitors: number;
  upcomingTours: number;
  status: "popular" | "trending" | "new";
  description: string;
}

const destinations: Destination[] = [
  {
    id: "D001",
    name: "Everest Base Camp",
    location: "Khumbu Region, Nepal",
    rating: 4.9,
    visitors: 2500,
    upcomingTours: 12,
    status: "popular",
    description: "Trek to the world's highest mountain base camp",
  },
  {
    id: "D002",
    name: "Annapurna Circuit",
    location: "Annapurna Region, Nepal",
    rating: 4.8,
    visitors: 1800,
    upcomingTours: 8,
    status: "trending",
    description: "Classic trek around the Annapurna massif",
  },
  {
    id: "D003",
    name: "Chitwan National Park",
    location: "Chitwan District, Nepal",
    rating: 4.7,
    visitors: 3200,
    upcomingTours: 15,
    status: "popular",
    description: "Wildlife safari in Nepal's first national park",
  },
  {
    id: "D004",
    name: "Upper Mustang",
    location: "Mustang District, Nepal",
    rating: 4.6,
    visitors: 900,
    upcomingTours: 5,
    status: "new",
    description: "Explore the hidden kingdom of Lo Manthang",
  },
];

export function DestinationList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Visitors</TableHead>
            <TableHead>Upcoming Tours</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {destinations.map((destination) => (
            <TableRow key={destination.id}>
              <TableCell className="font-medium">{destination.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {destination.location}
                </div>
              </TableCell>
              <TableCell className="max-w-[300px] truncate">
                {destination.description}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {destination.visitors.toLocaleString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {destination.upcomingTours}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {destination.rating}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    destination.status === "popular"
                      ? "default"
                      : destination.status === "trending"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {destination.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Destination</DropdownMenuItem>
                    <DropdownMenuItem>View Tours</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Remove Destination
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
