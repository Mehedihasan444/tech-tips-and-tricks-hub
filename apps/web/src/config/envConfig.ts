const getServerUrl = () =>
  process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || "http://localhost:5000";

const getBaseApi = () => {
  const serverUrl = getServerUrl();
  if (
    !process.env.NEXT_PUBLIC_SERVER_URL &&
    !process.env.SERVER_URL &&
    process.env.NODE_ENV === "production"
  ) {
    // NEXT_PUBLIC_* is inlined at build time: a missing value bakes localhost
    // into the client bundle. Warn loudly so misconfigured deploys are obvious.
    console.warn(
      "[envConfig] NEXT_PUBLIC_SERVER_URL is not set; falling back to localhost. Set it at build time.",
    );
  }
  return `${serverUrl}/api/v1`;
};

const envConfig = {
  baseApi: getBaseApi(),
  serverUrl: getServerUrl(),
};

export default envConfig;
