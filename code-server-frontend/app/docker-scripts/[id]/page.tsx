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
import { Textarea } from "@/components/ui/textarea";
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
  Trash2,
  Edit,
  FileCode,
  Download,
  Copy,
  Activity,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DockerScriptExecutor } from "@/components/docker-script-executor";
import { DockerScriptModal } from "@/components/modals/docker-script-modal";
import type { BuildStatus } from "@/lib/types";

// Mock data - in real app, this would come from API
const getDockerScript = (id: string) => ({
  id,
  name: "Node.js Development Environment",
  description:
    "A complete Node.js development environment with all necessary tools and dependencies",
  script: `FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git curl

# Copy package files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]`,
  credentialId: "1",
  credentialName: "Docker Hub Registry",
  registryUrl: "https://hub.docker.com",
  tag: "latest",
  buildStatus: "SUCCESS" as BuildStatus,
  testResult: "All tests passed successfully",
  logs: `Step 1/12 : FROM node:18-alpine
 ---> 7e4b2c8c9a1b
Step 2/12 : WORKDIR /app
 ---> Using cache
 ---> 8f3d2e1a9b4c
Step 3/12 : RUN apk add --no-cache git curl
 ---> Running in 5a2b3c4d5e6f
fetch https://dl-cdn.alpinelinux.org/alpine/v3.18/main/x86_64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.18/community/x86_64/APKINDEX.tar.gz
(1/7) Installing ca-certificates (20230506-r0)
(2/7) Installing git (2.40.1-r0)
(3/7) Installing curl (8.1.2-r0)
Executing busybox-1.36.1-r0.trigger
OK: 15 MiB in 22 packages
Removing intermediate container 5a2b3c4d5e6f
 ---> 9e8f7a6b5c4d
Successfully built and tagged johndoe/node-dev:latest`,
  pushedImageUrl: "johndoe/node-dev:latest",
  createdAt: new Date("2024-01-15T10:30:00"),
  updatedAt: new Date("2024-01-20T15:45:00"),
  lastBuild: new Date("2024-01-20T14:30:00"),
  buildDuration: "2m 34s",
  imageSize: "245 MB",
  buildHistory: [
    {
      id: "1",
      timestamp: new Date("2024-01-20T14:30:00"),
      status: "SUCCESS" as BuildStatus,
      duration: "2m 34s",
      tag: "latest",
    },
    {
      id: "2",
      timestamp: new Date("2024-01-19T16:20:00"),
      status: "SUCCESS" as BuildStatus,
      duration: "2m 41s",
      tag: "v1.0.1",
    },
    {
      id: "3",
      timestamp: new Date("2024-01-19T10:15:00"),
      status: "FAILED" as BuildStatus,
      duration: "1m 23s",
      tag: "v1.0.0",
    },
  ],
});

function getBuildStatusBadge(status: BuildStatus) {
  const variants: Record<
    BuildStatus,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    DRAFT: "outline",
    BUILDING: "secondary",
    SUCCESS: "default",
    FAILED: "destructive",
  };

  const colors: Record<BuildStatus, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    BUILDING: "bg-yellow-100 text-yellow-800",
    SUCCESS: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
  };

  return (
    <Badge variant={variants[status]} className={colors[status]}>
      {status}
    </Badge>
  );
}

export default function DockerScriptDetailPage() {
  const params = useParams();
  const scriptId = params.id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const script = getDockerScript(scriptId);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(script.script);
  };

  const handleStartExecution = () => {
    setIsExecuting(true);
  };

  return (
    <div className="flex flex-col min-h-screen px-4">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/docker-scripts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scripts
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <FileCode className="h-5 w-5" />
          <h1 className="text-xl font-semibold">{script.name}</h1>
          {getBuildStatusBadge(script.buildStatus)}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleStartExecution} disabled={isExecuting}>
            <Play className="h-4 w-4 mr-2" />
            Run Script
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
                Edit Script
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyScript}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Script
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download Dockerfile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Script
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Script Details */}
          <div className="space-y-6">
            <Tabs defaultValue="script" className="space-y-4">
              <TabsList>
                <TabsTrigger value="script">Dockerfile</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">Build History</TabsTrigger>
              </TabsList>

              <TabsContent value="script">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Dockerfile Content</CardTitle>
                        <CardDescription>
                          Docker build script configuration
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyScript}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={script.script}
                      readOnly
                      className="font-mono text-sm min-h-[400px] resize-none"
                      style={{ whiteSpace: "pre" }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Script Details</CardTitle>
                    <CardDescription>
                      Configuration and build information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Name
                        </p>
                        <p className="text-sm">{script.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Status
                        </p>
                        <div className="mt-1">
                          {getBuildStatusBadge(script.buildStatus)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Registry
                        </p>
                        <p className="text-sm">{script.credentialName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Tag
                        </p>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {script.tag}
                        </code>
                      </div>
                    </div>

                    <Separator />

                    {/* Build Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Last Build
                        </p>
                        <p className="text-sm">
                          {script.lastBuild.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Build Duration
                        </p>
                        <p className="text-sm">{script.buildDuration}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Image Size
                        </p>
                        <p className="text-sm">{script.imageSize}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Image URL
                        </p>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded break-all">
                          {script.pushedImageUrl}
                        </code>
                      </div>
                    </div>

                    <Separator />

                    {/* Description */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Description
                      </p>
                      <p className="text-sm mt-1">{script.description}</p>
                    </div>

                    {/* Test Results */}
                    {script.testResult && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Test Results
                        </p>
                        <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            {script.testResult}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Build History</CardTitle>
                    <CardDescription>
                      Previous build attempts and results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {script.buildHistory.map((build) => (
                        <div
                          key={build.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {build.status === "SUCCESS" ? (
                                <div className="h-2 w-2 bg-green-500 rounded-full" />
                              ) : (
                                <div className="h-2 w-2 bg-red-500 rounded-full" />
                              )}
                              {getBuildStatusBadge(build.status)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Build #{build.id}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {build.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">
                              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                {build.tag}
                              </code>
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {build.duration}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Execution Logs */}
          <div>
            {isExecuting ? (
              <DockerScriptExecutor
                scriptId={script.id}
                scriptName={script.name}
                onStatusChange={(status) => {
                  if (status !== "BUILDING") {
                    setIsExecuting(false);
                  }
                }}
              />
            ) : (
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Execution Logs
                  </CardTitle>
                  <CardDescription>
                    Real-time build logs will appear here when script is
                    executed
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Ready to Execute</p>
                    <p className="text-sm mb-4">
                      Click "Run Script" to start the Docker build process
                    </p>
                    <Button onClick={handleStartExecution}>
                      <Play className="h-4 w-4 mr-2" />
                      Run Script
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <DockerScriptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        script={script}
      />
    </div>
  );
}
