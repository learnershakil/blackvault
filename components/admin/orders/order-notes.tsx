"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface OrderNotesProps {
  orderId: string;
  initialNotes: string | null;
}

export default function OrderNotes({ orderId, initialNotes }: OrderNotesProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save notes");
      }

      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Order Notes</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            Edit Notes
          </Button>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md min-h-[100px] text-sm">
          {notes ? (
            <p className="whitespace-pre-wrap">{notes}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No notes for this order
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Edit Order Notes</h3>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full min-h-[150px] p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
        placeholder="Add notes about this order..."
        disabled={isSaving}
      ></textarea>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(false)}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSaveNotes}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Notes"}
        </Button>
      </div>
    </div>
  );
}
