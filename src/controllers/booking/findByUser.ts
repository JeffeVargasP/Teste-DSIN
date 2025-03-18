import express, { Express, Request, Response } from 'express';
import { database } from "../../../database";

export const findByUser = async (req: Request, res: Response): Promise<any> => {
    const userId = Number(req.params.userId);

    const bookings = await database.booking.findMany({
        where: { userId },
    });

    if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'Bookings not found' });
    }

    return res.status(200).json(bookings);
}