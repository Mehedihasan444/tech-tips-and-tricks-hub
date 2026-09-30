const envConfig = {
    // baseApi: "http://localhost:5000/api/v1",
    baseApi: `${process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL}/api/v1`,
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || "http://localhost:5000",
  };
  
  export default envConfig;