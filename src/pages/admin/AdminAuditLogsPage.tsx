import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuditLogs } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, User, Utensils, Settings, Shield } from 'lucide-react';
import { format } from 'date-fns';

const getActionIcon = (action: string) => {
  if (action.includes('USER')) return <User className="h-4 w-4" />;
  if (action.includes('FOOD')) return <Utensils className="h-4 w-4" />;
  if (action.includes('SETTINGS')) return <Settings className="h-4 w-4" />;
  return <Shield className="h-4 w-4" />;
};

const getActionBadgeVariant = (action: string): 'default' | 'secondary' | 'destructive' => {
  if (action.includes('DELETE') || action.includes('DISABLE')) return 'destructive';
  if (action.includes('CREATE') || action.includes('ENABLE')) return 'default';
  return 'secondary';
};

const formatAction = (action: string) => {
  return action
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export default function AdminAuditLogsPage() {
  const { data: logs, isLoading } = useAuditLogs(100);

  return (
    <AdminLayout title="Audit Logs" description="Track all administrative actions">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Admin Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : logs?.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Audit Logs</h3>
              <p className="text-muted-foreground">
                Admin actions will appear here once they are performed.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Admin ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {formatAction(log.action)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium capitalize">{log.target_type}</p>
                        {log.target_id && (
                          <p className="text-xs text-muted-foreground">
                            {log.target_id.slice(0, 8)}...
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.details ? (
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {JSON.stringify(log.details).slice(0, 50)}
                          {JSON.stringify(log.details).length > 50 ? '...' : ''}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground">
                        {log.admin_id.slice(0, 8)}...
                      </p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {format(new Date(log.created_at), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'HH:mm:ss')}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">About Audit Logs</h3>
              <p className="text-sm text-muted-foreground">
                Audit logs track all administrative actions for security and accountability purposes. 
                These logs are immutable and cannot be deleted. All user management actions, 
                food database changes, and system configuration updates are recorded here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
