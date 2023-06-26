import { Module } from 'vuex';

declare module './auth' {
  interface User {
    id: number;
    name: string;
    // Adjust the properties as per your application's user object
  }

  interface AuthState {
    user: User | null;
  }

  interface AuthGetters {
    isAuthenticated: boolean;
    getUserRole: string | null;
    hasPermission(permission: string): boolean;
  }

  const authModule: Module<AuthState, any>; // Adjust the second type parameter if needed

  export default authModule;
}
