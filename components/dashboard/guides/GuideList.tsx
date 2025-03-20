import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star, Calendar, Edit, MapPin } from "lucide-react";

interface Guide {
  id: string;
  name: string;
  location: string;
  rating: number;
  status: string;
  experience: string;
  languages: string[];
  profileImage?: string;
}

const guides: Guide[] = [
  {
    id: "G001",
    name: "Tenzing Sherpa",
    location: "Solukhumbu, Nepal",
    rating: 4.9,
    status: "active",
    experience: "15 years",
    languages: ["English", "Nepali", "Sherpa", "Hindi", "Basic Chinese"],
    profileImage: "/guides/tenzing.jpg",
  },
  {
    id: "G002",
    name: "Maria Rodriguez",
    location: "Cusco, Peru",
    rating: 4.8,
    status: "active",
    experience: "8 years",
    languages: ["English", "Spanish", "Portuguese"],
  },
  {
    id: "G003",
    name: "Ahmed Hassan",
    location: "Cairo, Egypt",
    rating: 4.7,
    status: "on_leave",
    experience: "12 years",
    languages: ["English", "Arabic", "French"],
  },
  {
    id: "G004",
    name: "Hiroshi Tanaka",
    location: "Kyoto, Japan",
    rating: 4.9,
    status: "active",
    experience: "10 years",
    languages: ["English", "Japanese", "Mandarin"],
  },
];

export function GuideList() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "on_leave":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            On Leave
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Guide</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Languages</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guides.map((guide) => (
            <TableRow key={guide.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    {guide.profileImage ? (
                      <AvatarImage src={guide.profileImage} alt={guide.name} />
                    ) : null}
                    <AvatarFallback>
                      {guide.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/dashboard/guides/${guide.id}`}
                      className="font-medium hover:underline"
                    >
                      {guide.name}
                    </Link>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{guide.location}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{guide.rating}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(guide.status)}</TableCell>
              <TableCell>{guide.experience}</TableCell>
              <TableCell>
                {guide.languages.slice(0, 2).join(", ")}
                {guide.languages.length > 2 ? ", ..." : ""}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/guides/${guide.id}`}>
                        View details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/guides/${guide.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit guide
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/guides/${guide.id}/schedule`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        View schedule
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Remove guide
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
