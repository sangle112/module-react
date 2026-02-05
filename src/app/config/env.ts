export const env = {
  API_URL: import.meta.env.VITE_API_URL as string,
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL as string,
  MODE: import.meta.env.MODE,
};

if (!env.API_URL) {
  console.warn("VITE_API_URL is missing");
}
