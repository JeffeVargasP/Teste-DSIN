import express, { Router, Request, Response } from "express";
import { database } from "../../../database";

export const update: Router = express.Router();

update.put("/:id", async (req: Request, res: Response): Promise<any> => {
    const id = Number(req.params.id);
    const { date, serviceId, status, time, userId } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "Bad Request: id is required!",
        });
    }

    const findBooking = await database.booking.findFirst({
        where: { id },
    });

    if (!findBooking) {
        return res.status(404).json({
            message: "Booking not found",
        });
    }

    if (userId) {
        const findUser = await database.user.findFirst({
            where: { id: userId },
        });

        if (!findUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }
    }

    const updateBooking = await database.booking.update({
        where: { id },
        data: {
            date: date || undefined,
            serviceId: serviceId || undefined,
            status: status || undefined,
            time: time || undefined,
            userId: userId || undefined,
        },
    });

    return res.status(200).json(updateBooking);
});