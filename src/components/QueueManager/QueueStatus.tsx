
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useOperationQueue } from '@/hooks/useOperationQueue';

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colorMap = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  };

  return (
    <Badge className={`${colorMap[priority as keyof typeof colorMap]} text-white`}>
      {priority}
    </Badge>
  );
};

const QueueStatus = () => {
  const { getQueueStatus, clearQueue, isProcessing, queueLength } = useOperationQueue();
  const status = getQueueStatus();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="relative"
          disabled={queueLength === 0}
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Coda operazioni
          {queueLength > 0 && (
            <Badge 
              className="ml-2 bg-primary text-primary-foreground" 
              variant="default"
            >
              {queueLength}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Stato della coda operazioni</SheetTitle>
          <SheetDescription>
            Gestisci le operazioni in coda e monitora il loro stato
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Operazioni totali: {status.total}</h4>
            <Progress value={(status.total - queueLength) / status.total * 100} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Dettaglio priorità</h4>
              {status.total > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={clearQueue}
                >
                  Svuota coda
                </Button>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priorità</TableHead>
                  <TableHead>Operazioni</TableHead>
                  <TableHead>Stato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(Object.entries(status.priorities) as [string, number][]).map(([priority, count]) => (
                  <TableRow key={priority}>
                    <TableCell>
                      <PriorityBadge priority={priority} />
                    </TableCell>
                    <TableCell>{count}</TableCell>
                    <TableCell>
                      {isProcessing && priority === 'high' ? (
                        <span className="flex items-center text-yellow-600">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          In elaborazione
                        </span>
                      ) : (
                        <span className="text-gray-500">In attesa</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default QueueStatus;
