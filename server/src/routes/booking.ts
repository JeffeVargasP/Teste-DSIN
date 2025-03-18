import express, { Router } from "express";
import { findAll } from "../controllers/booking/findAll";
import { findOne } from "../controllers/booking/findOne";
import { createBooking } from "../controllers/booking/create";
import { remove } from "../controllers/booking/remove";
import { update } from "../controllers/booking/update";
import { findByUser } from "../controllers/booking/findByUser";
import { findAvailable } from "../controllers/booking/findAvailable";
import { findDay } from "../controllers/booking/findDay";
import { findHistory } from "../controllers/booking/findHistory";
import { findWeek } from "../controllers/booking/findWeek";

export const bookingRoutes: Router = express.Router();

bookingRoutes.get("/", findAll);
bookingRoutes.get("/user/:userId", findByUser);
bookingRoutes.get("/available/:date", findAvailable);
bookingRoutes.get("/day/:date", findDay);
bookingRoutes.get("/history/:userId", findHistory);
bookingRoutes.get("/week/:userId", findWeek);
bookingRoutes.get("/:id", findOne);
bookingRoutes.post("/", createBooking);
bookingRoutes.delete("/:id", remove);
bookingRoutes.put("/:id", update);