"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clipboard, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateNoteContent } from "@/app/dashboard/(pages)/notes/[id]/actions";
import { fn } from "@/lib/utils";
import { Note } from "@/proto/note_pb";

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
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0 text-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clipboard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Generated Content
              </CardTitle>
              <CardDescription className="text-gray-600">
                You can regenerate the content up to 3 times.
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-center">
            {note.generatedContent && (
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="font-semibold w-full sm:w-auto border-gray-300 hover:bg-gray-50"
              >
                {!copied ? (
                  <>
                    <Clipboard className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied to Clipboard!
                  </>
                )}
              </Button>
            )}
            <Button
              className="font-semibold w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              onClick={() => generateContentMutation.mutate()}
              disabled={note.generatedCount >= 3 || generateContentMutation.isPending}
            >
              {generateContentMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : note.generatedContent ? (
                "Regenerate Content"
              ) : (
                "Generate Content"
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {note.generatedCount >= 3 && (
          <div className="flex items-center text-gray-600 text-sm mt-2 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Info className="h-4 w-4 mr-2 text-yellow-600" />
            <span className="text-yellow-800">
              You have reached the maximum number of generated content for this note. You can only generate content up to 3 times.
            </span>
          </div>
        )}
        {note.generatedContent ? (
          <Textarea
            value={note.generatedContent}
            rows={24}
            readOnly
            className="w-full resize-none border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80"
          />
        ) : (
          <div className="flex justify-center items-center h-32 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
            No generated content available. Click the "Generate Content" button to create content based on the note's events and steps.
          </div>
        )}
      </CardContent>
    </Card>
  );
}