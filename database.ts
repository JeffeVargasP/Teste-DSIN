import { config } from "./config.ts";
import { PrismaClient } from "@prisma/client";

const { name, username, password, host, dialect, logging } = config;

export const database = new PrismaClient();