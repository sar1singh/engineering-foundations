import type { DiscoveryPack } from "@/types/adaptive-discovery";
import { awsDiscoveryPack } from "./aws-discovery-pack";
import { backendDiscoveryPack } from "./backend-discovery-pack";
import { systemDesignDiscoveryPack } from "./system-design-discovery-pack";
import { securityDiscoveryPack } from "./security-discovery-pack";
import { careerDiscoveryPack } from "./career-discovery-pack";

export const discoveryPacks: DiscoveryPack[] = [
  awsDiscoveryPack,
  backendDiscoveryPack,
  systemDesignDiscoveryPack,
  securityDiscoveryPack,
  careerDiscoveryPack,
];

export const discoveryPacksByDomain: Record<string, DiscoveryPack> = {
  aws: awsDiscoveryPack,
  backend: backendDiscoveryPack,
  "system-design": systemDesignDiscoveryPack,
  security: securityDiscoveryPack,
  career: careerDiscoveryPack,
};

export { awsDiscoveryPack } from "./aws-discovery-pack";
export { backendDiscoveryPack } from "./backend-discovery-pack";
export { systemDesignDiscoveryPack } from "./system-design-discovery-pack";
export { securityDiscoveryPack } from "./security-discovery-pack";
export { careerDiscoveryPack } from "./career-discovery-pack";
