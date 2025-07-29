"use client";

import { API_END_POINTS } from "@/common/constant";
import { CredentialModal } from "@/components/modals/credential-modal";
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
import type { Credentials, CredentialType } from "@/lib/types";
import {
  Edit,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

function getTypeBadge(type: CredentialType) {
  const colors: Record<CredentialType, string> = {
    GITHUB: "bg-gray-100 text-gray-800",
    GITLAB: "bg-orange-100 text-orange-800",
    JIRA: "bg-blue-100 text-blue-800",
    CONFLUENCES: "bg-blue-100 text-blue-800",
    DOCKERHUB: "bg-cyan-100 text-cyan-800",
    GITHUB_CONTAINER: "bg-gray-100 text-gray-800",
  };

  return <Badge className={colors[type]}>{type.replace("_", " ")}</Badge>;
}

export default function CredentialsPage() {
  const {
    data,
    loading,
    get: fetchCredential,
    del: deleteCredentials,
  } = useFetch({
    url: `${process.env.NEXT_PUBLIC_BASE_API_POINT}${API_END_POINTS.CREDENTIALs.read}`,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<any>(null);
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());
  const [credentials, setCredentials] = useState<Credentials[]>([]);

  const loadCredentials = async () => {
    const response = await fetchCredential();
    if (response.status === "success") {
      setCredentials(response.data || []);
    }
  };
  useEffect(() => {
    loadCredentials();
  }, []);

  const filteredCredentials = credentials.filter(
    (credential) =>
      credential.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (credential: any) => {
    const response = await deleteCredentials(
      `${process.env.NEXT_PUBLIC_BASE_API_POINT}${API_END_POINTS.CREDENTIALs.delete}/${credential.id}`
    );
    if (response.status === "success") {
      loadCredentials();
    }
  };

  const handleEdit = (credential: any) => {
    setSelectedCredential(credential);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCredential(null);
    setIsModalOpen(true);
  };

  const toggleTokenVisibility = (id: string) => {
    const newVisible = new Set(visibleTokens);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleTokens(newVisible);
  };

  const maskToken = (token: string) => {
    return token.substring(0, 8) + "x".repeat(Math.max(0, token.length - 8));
  };

  return (
    <div className="flex flex-col min-h-screen px-4">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Credentials</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search credentials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Credential
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-10">
        <Card>
          <CardHeader>
            <CardTitle>Credentials ({filteredCredentials.length})</CardTitle>
            <CardDescription>
              Manage your service credentials and API tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Base URL</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCredentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell className="font-medium">
                      {credential.name}
                    </TableCell>
                    <TableCell>{getTypeBadge(credential.type)}</TableCell>
                    <TableCell>{credential.username}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {credential.baseUrl}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">
                          {credential &&
                          credential.id &&
                          visibleTokens.has(credential.id)
                            ? credential.token
                            : maskToken(credential.token)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (credential.id) {
                              toggleTokenVisibility(credential.id);
                            }
                          }}
                        >
                          {credential &&
                          credential.id &&
                          visibleTokens.has(credential.id) ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {credential.createdAt &&
                        new Date(credential.createdAt).toDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleEdit(credential)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(credential)}
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

      <CredentialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        credential={selectedCredential}
      />
    </div>
  );
}
