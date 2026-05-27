import { Clock4, Disc3, Hash, UserStar } from "lucide-react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";

export const AlbumHeaderSkeleton = () => {
  return (
    <>
      <Skeleton className="size-60 shadow-xl rounded" />
      <div className="flex flex-col justify-center gap-5">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="py-1 h-16 w-md" />
        <div className="flex flex-row gap-x-5 items-center ml-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </>
  )
}

export const AlbumTableSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="font-roboto text-base p-4 opacity-60">
          <TableHead><span className="flex items-center gap-1"><Hash className="size-4 inline" /></span></TableHead>
          <TableHead><span className="flex items-center gap-1"><Disc3 className="size-4 inline" />Title</span></TableHead>
          <TableHead><span className="flex items-center gap-1"><UserStar className="size-4 inline" />Artist</span></TableHead>
          <TableHead><span className="flex justify-end items-center gap-1"><Clock4 className="size-4 inline" />Duration</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array<React.ReactNode>(3)].map((_, id) => (
          <TableRow key={id} className="cursor-pointer group">
            <TableCell className="w-14">
              <Skeleton className="size-4" />
            </TableCell>
            <TableCell className="flex flex-row items-center gap-3">
              <Skeleton className="size-11 rounded" />
              <Skeleton className="h-5 w-20" />
            </TableCell>
            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
            <TableCell><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="font-bold">Total duration</TableCell>
          <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}