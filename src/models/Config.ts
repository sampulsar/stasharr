import { z } from "zod";

export const ConfigSchema = z.object({
  scheme: z.enum(["http", "https"]),
  domain: z.string().min(1, "Domain is required"),
  whisparrApiKey: z.string().min(1, "API Key is required"),
  qualityProfile: z
    .number()
    .min(0, "Quality profile must be a non-negative number"),
  rootFolderPath: z.string().min(1, "Root folder path is required"),
  searchForNewMovie: z.boolean(),
});

export class Config {
  scheme: string = "https";
  domain: string = "localhost:6969";
  whisparrApiKey: string = "";
  qualityProfile: number = 1;
  rootFolderPath: string = "";
  searchForNewMovie: boolean = true;

  get whisparrApiUrl(): string {
    return `${this.scheme}://${this.domain}/api/v3/`;
  }

  load() {
    console.log("Loading configuration");
    const savedConfig = localStorage.getItem("stasharr-config");
    if (savedConfig) {
      Object.assign(this, JSON.parse(savedConfig));
    }
  }

  save() {
    console.log("Saving configuration");
    localStorage.setItem("stasharr-config", JSON.stringify(this));
  }

  valid(): boolean {
    console.log("Validating configuration");
    try {
      ConfigSchema.parse(this);
      return true;
    } catch (error) {
      console.error("Validation failed:", error);
      return false;
    }
  }
}
