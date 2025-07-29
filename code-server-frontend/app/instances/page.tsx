"use client";

import type React from "react";

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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Play,
  Pause,
  Square,
  Trash2,
  ExternalLink,
  Edit,
  Activity,
} from "lucide-react";
import { InstanceModal } from "@/components/modals/instance-modal";
import type { InstanceStatus } from "@/lib/types";
import { useRouter } from "next/navigation";

// Mock data
const instances = [
  {
    id: "1",
    name: "Development Server",
    port: 8080,
    url: "https://dev.example.com",
    status: "RUNNING" as InstanceStatus,
    image: "codercom/code-server:latest",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Testing Environment",
    port: 8081,
    url: "https://test.example.com",
    status: "PENDING" as InstanceStatus,
    image: "codercom/code-server:4.9.1",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "3",
    name: "Production Mirror",
    port: 8082,
    url: "https://prod-mirror.example.com",
    status: "STOPPED" as InstanceStatus,
    image: "codercom/code-server:latest",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-18"),
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

export default function InstancesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<any>(null);
  const router = useRouter();

  const filteredInstances = instances.filter(
    (instance) =>
      instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (instance: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setSelectedInstance(instance);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedInstance(null);
    setIsModalOpen(true);
  };

  const handleRowClick = (instanceId: string) => {
    router.push(`/instances/${instanceId}`);
  };

  return (
    <div className="flex flex-col min-h-screen px-4">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Code Server Instances</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search instances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Instance
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Instances ({filteredInstances.length})</CardTitle>
            <CardDescription>
              Manage your code server instances - Click on a row to view details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstances.map((instance) => (
                  <TableRow
                    key={instance.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(instance.id)}
                  >
                    <TableCell className="font-medium">
                      {instance.name}
                    </TableCell>
                    <TableCell>{getStatusBadge(instance.status)}</TableCell>
                    <TableCell>{instance.port}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[200px]">
                          {instance.url}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={instance.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {instance.image}
                      </code>
                    </TableCell>
                    <TableCell>
                      {instance.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
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
                            onClick={(e) => handleEdit(instance, e)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Start
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Square className="mr-2 h-4 w-4" />
                            Stop
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(instance.id);
                            }}
                          >
                            <Activity className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => e.stopPropagation()}
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

      <InstanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        instance={selectedInstance}
      />
    </div>
  );
}
