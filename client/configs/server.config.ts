export const BASE_URL_API = `${
  process.env.NEXT_API_SERVER_URL
    ? `${process.env.NEXT_API_SERVER_URL}/api/`
    : 'https://vn25-fs-check-luandv-3624.onrender.com/api/'
}`;
