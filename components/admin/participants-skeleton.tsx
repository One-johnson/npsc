import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ParticipantsFiltersSkeleton() {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {[
        { labelWidth: "w-12", triggerWidth: "w-[min(100%,280px)]" },
        { labelWidth: "w-16", triggerWidth: "w-[180px]" },
        { labelWidth: "w-12", triggerWidth: "w-[160px]" },
      ].map((field, i) => (
        <div key={i} className="grid gap-2">
          <Skeleton className={`h-4 ${field.labelWidth}`} />
          <Skeleton className={`h-9 ${field.triggerWidth}`} />
        </div>
      ))}
    </div>
  );
}

export function ParticipantsMetaSkeleton() {
  return <Skeleton className="h-4 w-full max-w-md" />;
}

export function ParticipantTicketStatsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-10" />
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-border pt-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-12 w-full rounded-md" />
                ))}
              </div>
              <Skeleton className="h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const TABLE_COLUMNS = 8;
const TABLE_ROWS = 8;

export function ParticipantsTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full max-w-sm" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: TABLE_COLUMNS }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: TABLE_ROWS }).map((_, row) => (
              <TableRow key={row}>
                {Array.from({ length: TABLE_COLUMNS }).map((_, col) => (
                  <TableCell key={col}>
                    <Skeleton
                      className={
                        col === 0
                          ? "h-4 w-32"
                          : col === TABLE_COLUMNS - 1
                            ? "h-8 w-8"
                            : "h-4 w-full max-w-[120px]"
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

export function ParticipantsPanelSkeleton() {
  return (
    <div className="space-y-8">
      <ParticipantsFiltersSkeleton />
      <ParticipantsMetaSkeleton />
      <ParticipantTicketStatsSkeleton />
      <ParticipantsTableSkeleton />
    </div>
  );
}
