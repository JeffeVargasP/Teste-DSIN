import express, { Router } from "express";
import { findAll } from "../controllers/user/findAll";
import { findOne } from "../controllers/user/findOne";
import { createUser } from "../controllers/user/create";
import { loginUser } from "../controllers/user/login";

export const userRoutes: Router = express.Router();

userRoutes.use("/", findAll);
userRoutes.use("/id", findOne);
userRoutes.use("/register", createUser);
userRoutes.use("/login", loginUser);