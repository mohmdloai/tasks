import { ChevronDown, ChevronRight, User, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import type { Task } from '@/types';
import { AdminTaskCard } from './AdminTaskCard';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface UserTasksSectionProps {
  userId: string;
  tasks: Task[];
}

export function UserTasksSection({ userId, tasks }: UserTasksSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const pendingCount = tasks.filter((t) => t.status === 'PENDING').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  const handleCopyId = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      toast.success('User ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy user ID');
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border rounded-lg">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm font-mono">
                    {userId.slice(0, 12)}...
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleCopyId}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <Badge
                  variant="outline"
                  className="bg-status-pending/20 text-status-pending-foreground border-status-pending/30 text-xs"
                >
                  {pendingCount} pending
                </Badge>
              )}
              {inProgressCount > 0 && (
                <Badge
                  variant="outline"
                  className="bg-status-progress/20 text-status-progress-foreground border-status-progress/30 text-xs"
                >
                  {inProgressCount} in progress
                </Badge>
              )}
              {completedCount > 0 && (
                <Badge
                  variant="outline"
                  className="bg-status-completed/20 text-status-completed-foreground border-status-completed/30 text-xs"
                >
                  {completedCount} completed
                </Badge>
              )}
            </div>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-3">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/admin/users/${userId}`}>
                  <ExternalLink className="mr-2 h-3 w-3" />
                  View Details
                </Link>
              </Button>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <AdminTaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
