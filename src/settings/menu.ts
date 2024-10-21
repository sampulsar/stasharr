import { openSettingsMenu } from "../settings/settings";

export async function initMenu(): Promise<void> {
  GM_registerMenuCommand("Settings", openSettingsMenu, "s");
}
