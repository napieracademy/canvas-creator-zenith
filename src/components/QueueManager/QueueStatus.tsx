
import React, { useState } from 'react';
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
import { 
  Loader2, 
  Filter,
  ChevronDown,
  ChevronUp,
  X 
} from "lucide-react";
import { useOperationQueue } from '@/hooks/useOperationQueue';

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colorMap = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  };

  return (
    <Badge className={`${colorMap[priority as keyof typeof colorMap]} text-white animate-in fade-in-50 duration-300`}>
      {priority}
    </Badge>
  );
};

const QueueStatus = () => {
  const { getQueueStatus, clearQueue, isProcessing, queueLength } = useOperationQueue();
  const status = getQueueStatus();
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const filteredPriorities = Object.entries(status.priorities)
    .filter(([priority]) => 
      selectedPriorities.length === 0 || selectedPriorities.includes(priority)
    ) as [string, number][];

  const calculateSuccessRate = () => {
    const completed = status.total - queueLength;
    return status.total > 0 ? (completed / status.total * 100).toFixed(1) : '100';
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="relative group transition-all duration-300 hover:bg-primary/10"
          disabled={queueLength === 0}
        >
          {isProcessing && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin animate-in fade-in-0 duration-500" />
          )}
          Coda operazioni
          {queueLength > 0 && (
            <Badge 
              className="ml-2 bg-primary text-primary-foreground animate-in slide-in-from-right-5 duration-300" 
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
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Statistiche globali</h4>
              <span className="text-sm text-muted-foreground">
                Completamento: {calculateSuccessRate()}%
              </span>
            </div>
            <Progress 
              value={(status.total - queueLength) / status.total * 100} 
              className="animate-in fade-in-50 duration-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">Dettaglio priorità</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-8 w-8 p-0"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              {status.total > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={clearQueue}
                  className="animate-in fade-in-50 duration-300"
                >
                  Svuota coda
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="flex gap-2 animate-in slide-in-from-top-5 duration-300">
                {Object.keys(status.priorities).map(priority => (
                  <Button
                    key={priority}
                    variant={selectedPriorities.includes(priority) ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePriority(priority)}
                    className="transition-all duration-300"
                  >
                    {priority}
                    {selectedPriorities.includes(priority) && (
                      <X className="ml-2 h-3 w-3" />
                    )}
                  </Button>
                ))}
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priorità</TableHead>
                  <TableHead>Operazioni</TableHead>
                  <TableHead>Stato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPriorities.map(([priority, count]) => (
                  <TableRow 
                    key={priority}
                    className="animate-in fade-in-50 slide-in-from-left-5 duration-300"
                  >
                    <TableCell>
                      <PriorityBadge priority={priority} />
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">{count}</span>
                    </TableCell>
                    <TableCell>
                      {isProcessing && priority === 'high' ? (
                        <span className="flex items-center text-yellow-600 animate-pulse">
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
