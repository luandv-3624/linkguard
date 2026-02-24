export const BASE_URL_API = `${
  process.env.NEXT_API_SERVER_URL
    ? `${process.env.NEXT_API_SERVER_URL}/api/`
    : 'http://localhost:3000/api/'
}`;
