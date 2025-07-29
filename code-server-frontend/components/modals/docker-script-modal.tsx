"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { BuildStatus } from "@/lib/types";

interface DockerScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  script?: any;
}

// Mock credentials
const mockCredentials = [
  { id: "1", name: "Docker Hub Registry" },
  { id: "2", name: "GitHub Container Registry" },
  { id: "3", name: "GitLab Registry" },
];

export function DockerScriptModal({
  isOpen,
  onClose,
  script,
}: DockerScriptModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    script: "",
    credentialId: "",
    registryUrl: "",
    tag: "latest",
    buildStatus: "DRAFT" as BuildStatus,
  });

  useEffect(() => {
    if (script) {
      setFormData({
        name: script.name || "",
        script: script.script || "",
        credentialId: script.credentialId || "",
        registryUrl: script.registryUrl || "",
        tag: script.tag || "latest",
        buildStatus: script.buildStatus || "DRAFT",
      });
    } else {
      setFormData({
        name: "",
        script:
          'FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]',
        credentialId: "",
        registryUrl: "",
        tag: "latest",
        buildStatus: "DRAFT" as BuildStatus,
      });
    }
  }, [script]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {script ? "Edit Docker Script" : "Create New Docker Script"}
          </DialogTitle>
          {/* <DialogDescription>
            {script
              ? "Update the Docker script configuration."
              : "Create a new Docker build script."}
          </DialogDescription> */}
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            {/* Left Column (1/3 width on md+) */}
            <div className="space-y-4 col-span-1">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Node.js Dev Image"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="credential">Credential</Label>
                <Select
                  value={formData.credentialId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, credentialId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select credential" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCredentials.map((cred) => (
                      <SelectItem key={cred.id} value={cred.id}>
                        {cred.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="registryUrl">Registry URL</Label>
                <Input
                  id="registryUrl"
                  value={formData.registryUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, registryUrl: e.target.value })
                  }
                  placeholder="e.g. docker.io/username/image"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tag">Tag</Label>
                <Input
                  id="tag"
                  value={formData.tag}
                  onChange={(e) =>
                    setFormData({ ...formData, tag: e.target.value })
                  }
                  placeholder="latest"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="buildStatus">Build Status</Label>
                <Select
                  value={formData.buildStatus}
                  onValueChange={(value: BuildStatus) =>
                    setFormData({ ...formData, buildStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="BUILDING">Building</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column (2/3 width on md+) */}
            <div className="grid gap-2 h-full overflow-y-auto col-span-2">
              <Label htmlFor="script">Dockerfile</Label>
              <Textarea
                id="script"
                value={formData.script}
                onChange={(e) =>
                  setFormData({ ...formData, script: e.target.value })
                }
                className="font-mono text-sm h-full min-h-[370px]"
                placeholder="FROM node:18-alpine..."
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{script ? "Update" : "Create"} Script</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
