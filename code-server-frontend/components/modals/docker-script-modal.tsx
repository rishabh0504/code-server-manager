"use client";

import { API_END_POINTS } from "@/common/constant";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import type React from "react";
import { useEffect, useState } from "react";

interface DockerScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  script?: any;
}

export function DockerScriptModal({
  isOpen,
  onClose,
  script,
}: DockerScriptModalProps) {
  const { toast } = useToast();

  const {
    data,
    loading,
    post: createDockerScripts,
    put: updateDockerScripts,
  } = useFetch({
    url: `${process.env.NEXT_PUBLIC_BASE_API_POINT}${API_END_POINTS.DOCKER_SCRIPTS.create}`,
  });

  const [formData, setFormData] = useState({
    name: "",
    dockerFile: "",
    description: "",
    tag: "",
  });

  useEffect(() => {
    if (script) {
      setFormData({
        name: script.name || "",
        dockerFile: script.dockerFile || "",
        description: script.description || "",
        tag: script.tag || "",
      });
    } else {
      setFormData({
        name: "",
        dockerFile: "# This should be your docker script",
        description: "",
        tag: "",
      });
    }
  }, [script]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let response;

    if (script) {
      response = await updateDockerScripts(
        formData,
        `${process.env.NEXT_PUBLIC_BASE_API_POINT}${API_END_POINTS.DOCKER_SCRIPTS.update}/${script?.id}`
      );
    } else {
      response = await createDockerScripts(formData);
    }

    if (response.status === "success") {
      toast({
        title: script ? "Script Updated" : "Script Created",
        description: `"${formData.name}" was successfully ${
          script ? "updated" : "created"
        }.`,
      });
      onClose();
    } else {
      toast({
        title: "Something went wrong",
        description: `Failed to ${script ? "update" : "create"} the script.`,
        variant: "destructive", // if your toast UI supports this
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {script ? "Edit Docker Script" : "Create New Docker Script"}
          </DialogTitle>
          <DialogDescription>
            {script
              ? "Update the Docker script configuration."
              : "Create a new Docker build script."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            {/* Left Column (1/3 width on md+) */}
            <div className="space-y-4 col-span-1">
              <div className="grid gap-2">
                <Label htmlFor="name">Image Name</Label>
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
                <Label htmlFor="description">Docker Image Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Node.js Dev description"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Tag </Label>
                <Input
                  id="tag"
                  value={formData.tag}
                  onChange={(e) =>
                    setFormData({ ...formData, tag: e.target.value })
                  }
                  placeholder="Tag name"
                  required
                />
              </div>
            </div>

            {/* Right Column (2/3 width on md+) */}
            <div className="grid gap-2 h-full overflow-y-auto col-span-2">
              <Label htmlFor="script">Dockerfile</Label>
              <Textarea
                id="script"
                value={formData.dockerFile}
                onChange={(e) =>
                  setFormData({ ...formData, dockerFile: e.target.value })
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
