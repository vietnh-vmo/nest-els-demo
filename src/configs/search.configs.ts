export class ConfigSearch {
  public static searchConfig(url: string) {
    return {
      node: url,
      maxRetries: 5,
      requestTimeout: 60000,
      sniffOnStart: true,
    };
  }
}
