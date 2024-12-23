import { SceneStatus } from "../enums/SceneStatus";
import { Config } from "../models/Config";
import { CommandPayloadBuilder } from "../builder/CommandPayloadBuilder";
import { ScenePayloadBuilder } from "../builder/ScenePayloadBuilder";
import { Whisparr } from "../types/whisparr";
import ServiceBase from "./ServiceBase";
import ToastService from "./ToastService";

export default class WhisparrService extends ServiceBase {
  /**
   * Performs a health check on the Whisparr instance by sending a request to the health endpoint.
   *
   * @param {Config} config - The configuration object containing API details.
   * @returns {Promise<boolean>} - The response from the Whisparr API, indicating the health status of the instance.
   */ static healthCheck(config: Config): Promise<boolean> {
    return ServiceBase.request(config, "health").then((response) => {
      return response.status >= 200 && response.status < 300;
    });
  }

  /**
   * Run a Whisparr Command by sending a POST request with the command payload.
   *
   * @param {Config} config - The configuration object containing API details.
   * @param {any} body - The payload to send in the request body.
   * @returns {Promise<Whisparr.WhisparrCommandResponse | null>} - The response from the Whisparr API.
   */
  static async command(
    config: Config,
    body: Whisparr.CommandPayload,
  ): Promise<Whisparr.WhisparrCommandResponse | null> {
    const endpoint = "command";
    let response;
    try {
      response = await ServiceBase.request(config, endpoint, "POST", body);
    } catch (e) {
      ToastService.showToast(
        `Error occurred while executing ${body.name} command`,
        false,
      );
      console.error("Error in command", e);
      return null;
    }
    const data = await response.response;
    if (data) {
      return data as Whisparr.WhisparrCommandResponse;
    } else {
      return null;
    }
  }

  static async getQualityProfiles(
    config: Config,
  ): Promise<Whisparr.QualityProfile[]> {
    const endpoint = "qualityProfile";
    const response = await ServiceBase.request(
      config,
      endpoint,
      "GET",
      undefined,
      {
        "Content-Type": "application/json",
      },
    )
      .then((response) => response.response)
      .then((json) => {
        return json as Whisparr.QualityProfile[];
      });
    return response;
  }

  static async getQualityProfilesForSelectMenu(
    config: Config,
  ): Promise<{ id: number; name: string }[]> {
    let options: { id: number; name: string }[] = [];
    await WhisparrService.getQualityProfiles(config).then(
      (response: Whisparr.QualityProfile[]) => {
        response.forEach((qualityProfile) => {
          options.push({
            id: qualityProfile.id,
            name: qualityProfile.name,
          });
        });
      },
    );
    return options;
  }

  static async getRootFolderPathsForSelectMenu(
    config: Config,
  ): Promise<{ id: number; name: string }[]> {
    let options: { id: number; name: string }[] = [];

    await WhisparrService.getRootFolders(config).then(
      (response: Whisparr.RootFolder[]) => {
        response.forEach((rootFolder) => {
          options.push({
            id: rootFolder.id,
            name: rootFolder.path,
          });
        });
      },
    );

    return options;
  }

  static async getRootFolders(config: Config): Promise<Whisparr.RootFolder[]> {
    const endpoint = "rootFolder";
    const response = await ServiceBase.request(
      config,
      endpoint,
      "GET",
      undefined,
      {
        "Content-Type": "application/json",
      },
    )
      .then((response) => response.response)
      .then((json) => {
        return json as Whisparr.RootFolder[];
      });
    return response;
  }
}
