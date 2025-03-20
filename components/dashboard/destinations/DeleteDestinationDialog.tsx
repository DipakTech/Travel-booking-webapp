"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface DeleteDestinationDialogProps {
  destinationName: string;
  destinationId: string;
}

export function DeleteDestinationDialog({
  destinationName,
  destinationId,
}: DeleteDestinationDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== destinationName) return;

    setIsDeleting(true);
    try {
      // In a real application, this would call an API
      console.log(`Deleting destination with ID: ${destinationId}`);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close the dialog
      setOpen(false);

      // Navigate back to destinations list
      router.push("/dashboard/destinations");
    } catch (error) {
      console.error("Error deleting destination:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Destination
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            destination and remove all associated data including tours,
            bookings, and reviews.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4 rounded-md bg-amber-50 p-4 text-sm text-amber-900 border border-amber-200">
            <p className="font-medium">Warning:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>
                All tours associated with this destination will be deleted
              </li>
              <li>
                All reviews for this destination will be permanently removed
              </li>
              <li>Bookings related to this destination will be affected</li>
            </ul>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="confirm" className="mb-2 block">
                Please type{" "}
                <span className="font-semibold">{destinationName}</span> to
                confirm
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={destinationName}
                className="mt-1"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== destinationName || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Destination"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
