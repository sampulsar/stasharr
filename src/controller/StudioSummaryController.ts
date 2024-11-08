import { Config } from "../models/Config";
import WhisparrService from "../service/WhisparrService";
import { Whisparr } from "../types/types";

export class StudioSummaryController {
    static initialize(config: Config) {
        if (config.whisparrApiKey == "") return;
    
        const  studioTitle: HTMLElement | null =
            document.querySelector<HTMLElement>(".studio-title");

        // Get the current path.
        // If the full URL is https://fansdb.cc/studios/5ee16943-0da6-4ee4-94c1-54172e3d0b7e
        const path = window.location.pathname;

        const module = path.split('/')[1];
        const stashId = path.split('/')[2];

        if (module.toLowerCase() !== 'studios' || !stashId || studioTitle === null) {
            return;
        }

        (async () => {
            // Get the studio information 
            const studio = await WhisparrService.handleStudioLookup(config, stashId);
            console.log(studio);
            if (studio) {
                const studioDetailsDiv = StudioSummaryController.createHeaderDetails(studio);
                studioTitle.appendChild(studioDetailsDiv);
            }
        })();
    }

    private static createHeaderDetails(studio: Whisparr.WhisparrStudio): HTMLDivElement {
        const div = document.createElement("div");
        div.id = "whisparrStudioDetails";
        
        const divMonitored = document.createElement("div");
        divMonitored.innerText = `monitored: ${studio.monitored}`;
        div.appendChild(divMonitored);
        
        const divPath = document.createElement("div");
        divPath.innerText = `rootFolderPath: ${studio.rootFolderPath}`;
        div.appendChild(divPath);

        return div;
      }
}