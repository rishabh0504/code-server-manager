"use client";

import { API_END_POINTS } from "@/common/constant";
import DockerExecutorLogs from "@/components/modals/docker-executor-logs";
import { DockerScriptModal } from "@/components/modals/docker-script-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/use-fetch";
import type { DockerScript } from "@/lib/types";
import {
  Activity,
  ArrowLeft,
  Clock,
  Copy,
  Download,
  Edit,
  FileCode,
  MoreHorizontal,
  Play,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DockerScriptDetailPage() {
  const params = useParams();
  const scriptId = params.id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [dockerScript, setDockerScript] = useState<DockerScript | undefined>();

  const { get: fetchDockerScriptById } = useFetch({
    url: `${process.env.NEXT_PUBLIC_BASE_API_POINT}${API_END_POINTS.DOCKER_SCRIPTS.read}`,
  });

  const loadDockerScripts = async () => {
    const response = await fetchDockerScriptById(
      `${process.env.NEXT_PUBLIC_BASE_API_POINT}${API_END_POINTS.DOCKER_SCRIPTS.read}/${scriptId}`
    );
    if (response.status === "success") {
      setDockerScript(response.data);
    }
  };
  useEffect(() => {
    loadDockerScripts();
  }, []);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCopyScript = () => {
    if (dockerScript) {
      navigator.clipboard.writeText(dockerScript.dockerFile);
    }
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
          {dockerScript && (
            <h1 className="text-xl font-semibold">{dockerScript.name}</h1>
          )}
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
                      value={dockerScript?.dockerFile}
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
                      {dockerScript && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Name
                          </p>
                          <p className="text-sm">{dockerScript.name}</p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Build Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Last Script Updated
                        </p>
                        <p className="text-sm">
                          {dockerScript?.updatedAt &&
                            new Date(dockerScript?.updatedAt).toLocaleString()}
                        </p>
                      </div>

                      {/* <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Image Size
                        </p>
                        <p className="text-sm">{script.imageSize}</p>
                      </div> */}
                      {/* <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Image URL
                        </p>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded break-all">
                          {script.pushedImageUrl}
                        </code>
                      </div> */}
                    </div>

                    <Separator />

                    {/* Description */}
                    {dockerScript && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Description
                        </p>
                        <p className="text-sm mt-1">
                          {dockerScript.description}
                        </p>
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
                      {dockerScript?.builds?.map((build) => (
                        <Card key={build.id}>
                          <CardContent className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              {/* Status + Tag */}
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    build.status === "SUCCESS"
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                />
                                <Badge
                                  variant="secondary"
                                  className={
                                    build.status === "SUCCESS"
                                      ? "bg-green-500 text-white"
                                      : "bg-red-500 text-white"
                                  }
                                >
                                  {build.status}
                                </Badge>
                              </div>

                              {/* Build Info */}
                              <div>
                                <p className="text-sm font-medium">
                                  Build #{build.id}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {build.startedAt &&
                                    new Date(
                                      build.startedAt
                                    ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {/* Image Tag + Completed At */}
                            <div className="text-right space-y-1">
                              <code className="bg-muted text-xs px-2 py-1 rounded">
                                {build.imageTag}
                              </code>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {build.completedAt &&
                                  new Date(build.completedAt).toLocaleString()}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Execution Logs */}
          <div>
            {dockerScript && isExecuting ? (
              <DockerExecutorLogs scriptId={dockerScript.id} />
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
        script={dockerScript}
      />
    </div>
  );
}
