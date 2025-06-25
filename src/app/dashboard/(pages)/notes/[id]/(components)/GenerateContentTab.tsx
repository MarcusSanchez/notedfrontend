"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clipboard, Info } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "@/proto/note_pb";
import { generateNoteContent } from "@/app/dashboard/(pages)/notes/[id]/actions";
import { fn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export function GeneratedContent({ note }: { note: Note }) {
  const qc = useQueryClient();
  const [copied, setCopied] = useState(false);

  const generateContentMutation = useMutation({
    mutationKey: ["generateContent", note.id],
    mutationFn: fn(() => generateNoteContent({ noteId: note.id })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote", note.id] });
    },
  });

  const copyToClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(note.generatedContent!)
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      } else {
        // Fallback method for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = note.generatedContent!;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0 text-xl">
          <span>Generated Content</span>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            {note.generatedContent && (
              <Button variant="secondary" onClick={copyToClipboard} className="font-bold w-full">
                {!copied ? (
                  <>
                    <Clipboard className="h-4 w-4 font-bold" />
                    Copy to Clipboard
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 font-bold" />
                    Copied to Clipboard!
                  </>
                )}
              </Button>
            )}
            <Button
              className="font-bold w-full"
              onClick={() => generateContentMutation.mutate()}
              disabled={note.generatedCount >= 3 || generateContentMutation.isPending}
            >
              {generateContentMutation.isPending ? "Generating..." : note.generatedContent ? "Regenerate Content" : "Generate Content"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {note.generatedCount >= 3 && (
          <div className="flex items-center text-muted-foreground text-sm mt-2 mb-4">
            <Info className="h-4 w-4 mr-2" />
            You have reached the maximum number of generated content for this note. You can only generate content up to 3 times.
          </div>
        )}
        {note.generatedContent ? (
          <Textarea
            value={note.generatedContent}
            rows={24}
            readOnly
            className="w-full h-[auto] resize-none"
          />
        ) : (
          <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
            No generated content available. Click the &#34;Generate Content&#34; button to create content based on the note&#39;s events and steps.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
