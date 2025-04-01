import { Right } from "@/lib/types";

export type RoleData = {
  id: string;
  name: string;
  description: string;
  rights: Right[];
};
