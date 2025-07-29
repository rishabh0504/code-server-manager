"use client";

import type React from "react";

import { API_END_POINTS } from "@/common/constant";
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
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/use-fetch";
import type { BuildStatus, DockerScript } from "@/lib/types";
import {
  Download,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function DockerScriptsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const router = useRouter();
  const {
    data,
    loading,
    get: fetchDockerScripts,
  } = useFetch({
    url: `${process.env.NEXT_PUBLIC_BASE_API_POINT}${API_END_POINTS.DOCKER_SCRIPTS.read}`,
  });

  const [dockerScripts, setDockerScripts] = useState<DockerScript[]>([]);

  const loadDockerScripts = async () => {
    const response = await fetchDockerScripts();
    if (response.status === "success") {
      setDockerScripts(response.data || []);
    }
  };
  useEffect(() => {
    loadDockerScripts();
  }, []);

  const filteredScripts = dockerScripts.filter(
    (script) =>
      script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (script: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setSelectedScript(script);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedScript(null);
    setIsModalOpen(true);
  };

  const handleRowClick = (scriptId: string) => {
    router.push(`/docker-scripts/${scriptId}`);
  };

  return (
    <div className="flex flex-col min-h-screen px-4">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Docker Scripts</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Script
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Docker Scripts ({filteredScripts.length})</CardTitle>
            <CardDescription>
              Manage your Docker build scripts and container configurations -
              Click on a row to view details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScripts.map((script) => (
                  <TableRow
                    key={script.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(script.id)}
                  >
                    <TableCell>
                      <p className="font-medium">{script.name}</p>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {script.description}
                      </p>
                    </TableCell>

                    <TableCell>
                      {script.createdAt ? (
                        <span>{new Date(script.createdAt).toDateString()}</span>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {script.updatedAt ? (
                        <span>{new Date(script.updatedAt).toDateString()}</span>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(script.id);
                            }}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              // handleRowClick(script.id); // You can replace this with handleRun if needed
                            }}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Run Script
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(script, e);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              // handleViewScript(script);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Script
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              // handleDownloadLogs(script.id);
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Logs
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              // handleDelete(script.id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <DockerScriptModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadDockerScripts();
        }}
        script={selectedScript}
      />
    </div>
  );
}
