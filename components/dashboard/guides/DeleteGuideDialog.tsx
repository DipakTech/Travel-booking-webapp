"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteGuideDialogProps {
  guideName: string;
  guideId: string;
}

export function DeleteGuideDialog({
  guideName,
  guideId,
}: DeleteGuideDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // In a real app, you would call an API to delete the guide
      // Example: await fetch(`/api/guides/${guideId}`, { method: 'DELETE' });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close dialog and redirect
      setIsOpen(false);
      router.push("/dashboard/guides");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete guide:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Guide</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-medium">{guideName}</span> from the system?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Guide"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
