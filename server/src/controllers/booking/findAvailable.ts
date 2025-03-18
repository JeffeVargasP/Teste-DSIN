import express, { Express, Request, Response } from 'express';
import { database } from "../../../database";

export const findAvailable = async (req: Request, res: Response): Promise<any> => {
    const date = req.params.date;

    const bookings = await database.booking.findMany({
        where: { date },
    });

    return res.status(200).json(bookings);
}
