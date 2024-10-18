export class Options {
  public whisparrAPIUrl: string;

  constructor(
    public scheme: string = "http",
    public whisparrDomainOrIPWithPort: string = "localhost:6969",
    public whisparrAPIKey: string,
    public qualityProfileId: number,
    public rootFolderPath: string,
  ) {
    this.whisparrAPIUrl = `${scheme}://${whisparrDomainOrIPWithPort}/api/v3/lookup/scene`;
  }
}
