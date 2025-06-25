"use client";

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { NoteInformationTab } from "@/app/dashboard/(pages)/notes/[id]/(components)/NoteInformationTab"
import { fn, statusFrom } from "@/lib/utils"
import { getNote } from "@/app/dashboard/(pages)/notes/[id]/actions"
import { Code } from "@connectrpc/connect"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { NoteTabs } from "@/app/dashboard/(pages)/notes/[id]/(components)/NoteTabs";
import { DashboardContainer } from "@/app/dashboard/(components)/DashboardContainer";
import { GeneratedContent } from "@/app/dashboard/(pages)/notes/[id]/(components)/GenerateContentTab";

export default function SpecificNote() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const noteQ = useQuery({
    queryKey: ["getNote", id],
    queryFn: fn(() => getNote({ noteId: id })),
    retry: (failureCount, error) => {
      const status = statusFrom(error)
      if (status.code === Code.NotFound || status.code === Code.PermissionDenied) {
        router.replace("/404")
        return false
      }
      return failureCount < 3
    },
  })
  const note = noteQ.data?.note

  if (noteQ.isPending || (noteQ.isError && noteQ.isFetching)) return <SpecificNoteSkeleton />
  if (noteQ.isError) return <SpecificNoteError q={noteQ} />

  return (
    <DashboardContainer>
      <h1 className="w-min text-nowrap bg-background text-3xl font-bold mb-4">Note Management</h1>
      <div className="mx-auto pt-0">
        {note && (<>
          <GeneratedContent note={note} />
          <NoteTabs note={note} />
        </>)}
      </div>
    </DashboardContainer>
  )
}

function SpecificNoteSkeleton() {
  return (
    <DashboardContainer>
      <h1 className="text-3xl font-bold mb-4">
        <Skeleton className="w-48 h-9" />
      </h1>
      <div className="mx-auto pt-0">
        <Card className="w-full mx-auto mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-40 h-8" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="w-24 h-4 mb-2" />
                  <Skeleton className="w-full h-10" />
                </div>
              ))}
              <div className="md:col-span-2">
                <Skeleton className="w-32 h-4 mb-2" />
                <Skeleton className="w-full h-24" />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <Skeleton className="w-32 h-10" />
              <Skeleton className="w-32 h-10" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex justify-between items-center text-xl">
              <Skeleton className="w-24 h-6" />
              <Skeleton className="w-32 h-10" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="w-full h-8 mb-2" />
                  <Skeleton className="w-3/4 h-4 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="w-1/2 h-4" />
                    <Skeleton className="w-2/3 h-4" />
                    <Skeleton className="w-1/3 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardContainer>
  )
}

function SpecificNoteError({ q }: { q: ReturnType<typeof useQuery> }) {
  const router = useRouter()

  return (
    <div className="w-full mx-auto p-4">
      <Card className="w-full mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-lg md:text-2xl font-bold text-center">Failed to Load Note Data</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto text-xs md:text-base">
            We encountered an error while trying to fetch the note information.
            This could be due to a network issue or you may not have permissions to view this note.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.back()} variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={() => q.refetch()} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}