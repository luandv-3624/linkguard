import { BaseAPI } from './base';

class AuthAPI extends BaseAPI {
  async login(email: string, password: string) {
    try {
      const response = await this.httpClientPublic.post(
        `/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      console.log('Login response:', response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const response = await this.httpClientPrivate.post(
        `/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const authAPI: AuthAPI = new AuthAPI();
