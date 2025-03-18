import express, { Express, Request, Response } from "express";
import { database } from "../../../database";

export const createBooking: Express = express();

createBooking.post("/", async (req: Request, res: Response): Promise<any> => {
    const { date, serviceId, time, userId } = req.body;

    if (!date || !serviceId || !time || !userId) {
        return res.status(400).json({
            message: "Bad Request: date, serviceId, time, userId are required!",
        });
    }

    const findUser = await database.user.findFirst({
        where: { id: userId },
    });

    if (!findUser) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    const createBooking = await database.booking.create({
        data: {
            date,
            serviceId,
            time,
            userId,
            status: "pending"
        }
    });

    return res.status(201).json(createBooking);
});