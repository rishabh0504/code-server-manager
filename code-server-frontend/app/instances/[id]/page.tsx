"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  MoreHorizontal,
  Play,
  Pause,
  Square,
  Trash2,
  ExternalLink,
  Edit,
  Server,
  Globe,
  ImageIcon,
  Activity,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LogViewer } from "@/components/log-viewer";
import { InstanceModal } from "@/components/modals/instance-modal";
import type { InstanceStatus } from "@/lib/types";

// Mock data - in real app, this would come from API
const getInstance = (id: string) => ({
  id,
  name: "Development Server",
  port: 8080,
  url: "https://dev.example.com",
  status: "RUNNING" as InstanceStatus,
  image: "codercom/code-server:latest",
  createdAt: new Date("2024-01-15T10:30:00"),
  updatedAt: new Date("2024-01-20T15:45:00"),
  description: "Primary development environment for the frontend team",
  version: "4.19.1",
  cpu: "2 cores",
  memory: "4GB",
  storage: "50GB",
  uptime: "5 days, 12 hours",
  lastRestart: new Date("2024-01-15T10:30:00"),
  environment: {
    NODE_ENV: "development",
    PORT: "3000",
    DATABASE_URL: "postgresql://localhost:5432/dev",
    REDIS_URL: "redis://localhost:6379",
  },
  volumes: [
    { host: "/home/user/projects", container: "/workspace", type: "bind" },
    { host: "code-server-data", container: "/home/coder", type: "volume" },
  ],
  networks: ["bridge", "code-server-network"],
});

const getRecentActivities = () => [
  {
    id: "1",
    timestamp: new Date("2024-01-20T15:45:00"),
    level: "INFO" as const,
    message: "HTTP server listening on http://0.0.0.0:8080",
    source: "server",
  },
  {
    id: "2",
    timestamp: new Date("2024-01-20T15:44:55"),
    level: "INFO" as const,
    message: "Extension host started with pid 12345",
    source: "extension",
  },
  {
    id: "3",
    timestamp: new Date("2024-01-20T15:44:50"),
    level: "DEBUG" as const,
    message: "WebSocket connection established from 192.168.1.100",
    source: "websocket",
  },
];

function getStatusBadge(status: InstanceStatus) {
  const variants: Record<
    InstanceStatus,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    RUNNING: "default",
    PENDING: "secondary",
    PAUSED: "outline",
    STOPPED: "outline",
    TERMINATED: "destructive",
    ERROR: "destructive",
  };

  const colors: Record<InstanceStatus, string> = {
    RUNNING: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    PAUSED: "bg-blue-100 text-blue-800",
    STOPPED: "bg-gray-100 text-gray-800",
    TERMINATED: "bg-red-100 text-red-800",
    ERROR: "bg-red-100 text-red-800",
  };

  return (
    <Badge variant={variants[status]} className={colors[status]}>
      {status}
    </Badge>
  );
}

export default function InstanceDetailPage() {
  const params = useParams();
  const instanceId = params.id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const instance = getInstance(instanceId);
  const recentActivities = getRecentActivities();

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen px-4">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/instances">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Instances
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          <h1 className="text-xl font-semibold">{instance.name}</h1>
          {getStatusBadge(instance.status)}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={instance.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Instance
            </a>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Instance
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Play className="mr-2 h-4 w-4" />
                Start
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Square className="mr-2 h-4 w-4" />
                Stop
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Instance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Instance Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{instance.status}</div>
                  <p className="text-xs text-muted-foreground">
                    Uptime: {instance.uptime}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Port</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{instance.port}</div>
                  <p className="text-xs text-muted-foreground">HTTP endpoint</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Version</CardTitle>
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{instance.version}</div>
                  <p className="text-xs text-muted-foreground">code-server</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Resources
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{instance.cpu}</div>
                  <p className="text-xs text-muted-foreground">
                    {instance.memory} RAM
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Instance Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Instance Details</CardTitle>
                  <CardDescription>
                    Basic information about this code server instance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Name
                      </p>
                      <p className="text-sm">{instance.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Image
                      </p>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {instance.image}
                      </code>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Storage
                      </p>
                      <p className="text-sm">{instance.storage}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Created
                      </p>
                      <p className="text-sm">
                        {instance.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Last Updated
                      </p>
                      <p className="text-sm">
                        {instance.updatedAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Description
                    </p>
                    <p className="text-sm">{instance.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest events from this instance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 text-sm"
                      >
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="text-xs">
                            {activity.level}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-xs bg-muted/50 p-2 rounded break-all">
                            {activity.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <LogViewer instanceId={instance.id} instanceName={instance.name} />
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Environment Variables */}
              <Card>
                <CardHeader>
                  <CardTitle>Environment Variables</CardTitle>
                  <CardDescription>
                    Environment configuration for this instance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(instance.environment).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <code className="text-sm font-medium">{key}</code>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {value}
                          </code>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Volume Mounts */}
              <Card>
                <CardHeader>
                  <CardTitle>Volume Mounts</CardTitle>
                  <CardDescription>
                    Mounted volumes and storage configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {instance.volumes.map((volume, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{volume.type}</Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="font-medium">Host:</span>
                            <code className="ml-2 bg-muted px-1 py-0.5 rounded">
                              {volume.host}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium">Container:</span>
                            <code className="ml-2 bg-muted px-1 py-0.5 rounded">
                              {volume.container}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Networks */}
            <Card>
              <CardHeader>
                <CardTitle>Network Configuration</CardTitle>
                <CardDescription>
                  Network settings and connectivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {instance.networks.map((network) => (
                    <Badge key={network} variant="secondary">
                      {network}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle>Performance Monitoring</CardTitle>
                <CardDescription>
                  Resource usage and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Monitoring dashboard coming soon...</p>
                  <p className="text-sm">
                    CPU, Memory, and Network usage charts will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {isModalOpen && instance && (
        <InstanceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          instance={instance}
        />
      )}
    </div>
  );
}
