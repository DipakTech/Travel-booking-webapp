import { destinations } from "@/data/destinations";
import { guides } from "@/data/guides";
import { notFound } from "next/navigation";
import DestinationDetail from "./DestinationDetail";

interface DestinationDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return destinations.map((destination) => ({
    id: destination.id,
  }));
}

export default function DestinationDetailPage({
  params,
}: DestinationDetailPageProps) {
  const destination = destinations.find((d) => d.id === params.id);

  if (!destination) {
    notFound();
  }

  const recommendedGuides = guides.filter((guide) =>
    destination.recommendedGuides.includes(guide.id as string),
  );

  return (
    <DestinationDetail
      destination={destination}
      recommendedGuides={recommendedGuides}
    />
  );
}
