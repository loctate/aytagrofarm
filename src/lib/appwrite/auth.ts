import { account } from "./client";

export async function loginAdmin(
  email: string,
  password: string
) {
  return account.createEmailPasswordSession({
    email,
    password,
  });
}

export async function getCurrentAdmin() {
  return account.get();
}

export async function logoutAdmin() {
  return account.deleteSession({
    sessionId: "current",
  });
}
