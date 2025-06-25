type Config = {
  api: {
    baseUrl: string;
  };
};

export const config: Config = {
  api: {
    baseUrl: process.env.BACKEND_URL || "http://localhost:50051",
  }
}
