import { Account, Client, Storage, TablesDB } from "appwrite";
import {
  appwriteConfig,
  validateAppwriteClientConfig,
} from "./config";

validateAppwriteClientConfig();

export const appwriteClient = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(appwriteClient);
export const tablesDB = new TablesDB(appwriteClient);
export const storage = new Storage(appwriteClient);
