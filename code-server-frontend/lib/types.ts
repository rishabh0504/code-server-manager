// Types based on Prisma schema
export enum CredentialType {
  GITHUB = "GITHUB",
  GITLAB = "GITLAB",
  JIRA = "JIRA",
  CONFLUENCES = "CONFLUENCES",
  DOCKERHUB = "DOCKERHUB",
  GITHUB_CONTAINER = "GITHUB_CONTAINER",
}

export enum InstanceStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
  STOPPED = "STOPPED",
  TERMINATED = "TERMINATED",
  ERROR = "ERROR",
}

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

export enum BuildStatus {
  DRAFT = "DRAFT",
  BUILDING = "BUILDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface CodeServerInstance {
  id: string;
  name: string;
  port: number;
  url: string;
  status: InstanceStatus;
  image?: string;
  activities: ActivityLogger[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLogger {
  id: string;
  codeServerId: string;
  codeServer: CodeServerInstance;
  message: string;
  level: LogLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface Credentials {
  id?: string;
  type: CredentialType;
  name: string;
  token: string;
  baseUrl: string;
  username: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DockerScript {
  id: string;
  dockerFile: string;
  name: string;
  description: string;
  builds: any | null; // You can replace `any` with a specific type if you know the structure
  createdAt: Date; // or `Date` if you parse it
  updatedAt: Date; // or `Date` if you parse it
}
