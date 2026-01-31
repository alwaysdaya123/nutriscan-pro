import { AdminLayout } from '@/components/admin/AdminLayout';
import { useSystemHealth } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Database,
  Server,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Zap,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function AdminSystemPage() {
  const { data: health, isLoading, refetch } = useSystemHealth();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok':
      case 'healthy':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Degraded</Badge>;
      default:
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Unhealthy</Badge>;
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return 'text-green-500';
    if (latency < 300) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <AdminLayout title="System Health" description="Monitor platform performance and status">
      {/* Header Actions */}
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* Overall Status */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${
                health?.overall === 'healthy' 
                  ? 'bg-green-500/10' 
                  : health?.overall === 'degraded'
                  ? 'bg-yellow-500/10'
                  : 'bg-red-500/10'
              }`}>
                <Activity className={`h-8 w-8 ${
                  health?.overall === 'healthy'
                    ? 'text-green-500'
                    : health?.overall === 'degraded'
                    ? 'text-yellow-500'
                    : 'text-red-500'
                }`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">System Status</h2>
                <p className="text-muted-foreground">
                  Overall platform health and performance
                </p>
              </div>
            </div>
            {health && getStatusBadge(health.overall)}
          </div>
        </CardContent>
      </Card>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <div className="flex items-center gap-2">
                  {health && getStatusIcon(health.database.status)}
                  <span className="font-medium capitalize">{health?.database.status || 'Unknown'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Response Time</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className={`font-medium ${health ? getLatencyColor(health.database.latency) : ''}`}>
                    {health?.database.latency || 0}ms
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4" />
                  {health?.database.latency && health.database.latency < 100
                    ? 'Excellent performance'
                    : health?.database.latency && health.database.latency < 300
                    ? 'Good performance'
                    : 'Performance may be degraded'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              API Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <div className="flex items-center gap-2">
                  {health && getStatusIcon(health.api.status)}
                  <span className="font-medium capitalize">{health?.api.status || 'Unknown'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Response Time</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className={`font-medium ${health ? getLatencyColor(health.api.latency) : ''}`}>
                    {health?.api.latency || 0}ms
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4" />
                  {health?.api.status === 'ok'
                    ? 'All endpoints operational'
                    : 'Some endpoints may be unavailable'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Last Health Check</p>
              <p className="font-medium">
                {health?.timestamp
                  ? new Date(health.timestamp).toLocaleString()
                  : 'Never'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Auto Refresh</p>
              <p className="font-medium">Every 30 seconds</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Platform Version</p>
              <p className="font-medium">1.0.0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {health?.overall === 'healthy' ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              No active alerts. All systems are operating normally.
            </div>
          ) : (
            <div className="space-y-3">
              {health?.database.status !== 'ok' && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-600">Database Connection Issue</p>
                    <p className="text-sm text-muted-foreground">
                      Unable to connect to the database. Please check the database status.
                    </p>
                  </div>
                </div>
              )}
              {health?.api.status !== 'ok' && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-yellow-600">API Service Degraded</p>
                    <p className="text-sm text-muted-foreground">
                      Some API endpoints may be experiencing issues.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
