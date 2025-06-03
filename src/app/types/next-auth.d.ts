// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";
import { AdapterUser as DefaultAdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      admin: boolean;
      superAdmin: boolean;
    } & DefaultSession["user"];
  }

  // Mở rộng DefaultUser để thêm các trường custom
  interface User extends DefaultUser {
    id: string;
    admin: boolean;
    superAdmin: boolean;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends DefaultAdapterUser {
    admin: boolean;
    superAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    admin: boolean;
    superAdmin: boolean;
  }
}
