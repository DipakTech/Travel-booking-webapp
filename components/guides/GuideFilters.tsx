"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const specialties = [
  { id: "trekking", label: "Himalayan Trekking" },
  { id: "cultural", label: "Cultural Heritage" },
  { id: "adventure", label: "Adventure Sports" },
  { id: "spiritual", label: "Spiritual Tours" },
];

const languages = [
  { id: "english", label: "English" },
  { id: "nepali", label: "Nepali" },
  { id: "hindi", label: "Hindi" },
  { id: "tibetan", label: "Tibetan" },
];

const regions = [
  { id: "everest", label: "Everest Region" },
  { id: "annapurna", label: "Annapurna Circuit" },
  { id: "langtang", label: "Langtang Valley" },
  { id: "kathmandu", label: "Kathmandu Valley" },
];

export function GuideFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Specialties
        </h3>
        <div className="space-y-3">
          {specialties.map((specialty) => (
            <div key={specialty.id} className="flex items-center space-x-2">
              <Checkbox id={specialty.id} />
              <Label htmlFor={specialty.id}>{specialty.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
        <div className="space-y-3">
          {languages.map((language) => (
            <div key={language.id} className="flex items-center space-x-2">
              <Checkbox id={language.id} />
              <Label htmlFor={language.id}>{language.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regions</h3>
        <div className="space-y-3">
          {regions.map((region) => (
            <div key={region.id} className="flex items-center space-x-2">
              <Checkbox id={region.id} />
              <Label htmlFor={region.id}>{region.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
