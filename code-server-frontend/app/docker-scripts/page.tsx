"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Play, Eye, Download, FileText } from "lucide-react"
import { DockerScriptModal } from "@/components/modals/docker-script-modal"
import { useRouter } from "next/navigation"
import type { BuildStatus } from "@/lib/types"

// Mock data
const dockerScripts = [
  {
    id: "1",
    name: "Node.js Development Environment",
    description: "Complete Node.js development setup with tools",
    script:
      'FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]',
    credentialId: "1",
    credentialName: "Docker Hub Registry",
    registryUrl: "https://hub.docker.com",
    tag: "latest",
    buildStatus: "SUCCESS" as BuildStatus,
    testResult: "All tests passed",
    pushedImageUrl: "johndoe/node-dev:latest",
    createdAt: new Date("2024-01-15"),
    lastBuild: new Date("2024-01-20T14:30:00"),
  },
  {
    id: "2",
    name: "Python Data Science Stack",
    description: "Python environment with data science libraries",
    script:
      'FROM python:3.9-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nEXPOSE 8888\nCMD ["jupyter", "notebook"]',
    credentialId: "1",
    credentialName: "Docker Hub Registry",
    registryUrl: "https://hub.docker.com",
    tag: "v1.0.0",
    buildStatus: "BUILDING" as BuildStatus,
    testResult: null,
    pushedImageUrl: null,
    createdAt: new Date("2024-01-16"),
    lastBuild: new Date("2024-01-19T16:20:00"),
  },
  {
    id: "3",
    name: "React Production Build",
    description: "Optimized React production deployment",
    script:
      'FROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=builder /app/build /usr/share/nginx/html\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]',
    credentialId: "2",
    credentialName: "GitHub Container Registry",
    registryUrl: "https://ghcr.io",
    tag: "latest",
    buildStatus: "FAILED" as BuildStatus,
    testResult: "Build failed: Module not found",
    pushedImageUrl: null,
    createdAt: new Date("2024-01-17"),
    lastBuild: new Date("2024-01-18T10:15:00"),
  },
]

function getBuildStatusBadge(status: BuildStatus) {
  const variants: Record<BuildStatus, "default" | "secondary" | "destructive" | "outline"> = {
    DRAFT: "outline",
    BUILDING: "secondary",
    SUCCESS: "default",
    FAILED: "destructive",
  }

  const colors: Record<BuildStatus, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    BUILDING: "bg-yellow-100 text-yellow-800",
    SUCCESS: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
  }

  return (
    <Badge variant={variants[status]} className={colors[status]}>
      {status}
    </Badge>
  )
}

export default function DockerScriptsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedScript, setSelectedScript] = useState<any>(null)
  const router = useRouter()

  const filteredScripts = dockerScripts.filter(
    (script) =>
      script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.credentialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (script: any, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click
    setSelectedScript(script)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedScript(null)
    setIsModalOpen(true)
  }

  const handleRowClick = (scriptId: string) => {
    router.push(`/docker-scripts/${scriptId}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
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
              Manage your Docker build scripts and container configurations - Click on a row to view details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registry</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Last Build</TableHead>
                  <TableHead>Created</TableHead>
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
                      <div>
                        <p className="font-medium">{script.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">{script.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getBuildStatusBadge(script.buildStatus)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{script.credentialName}</div>
                        <div className="text-xs text-muted-foreground">{script.registryUrl}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">{script.tag}</code>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {script.lastBuild ? (
                          <>
                            <div>{script.lastBuild.toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">{script.lastBuild.toLocaleTimeString()}</div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{script.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRowClick(script.id)
                            }}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRowClick(script.id)
                            }}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Run Script
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleEdit(script, e)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Script
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Logs
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
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

      <DockerScriptModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} script={selectedScript} />
    </div>
  )
}
