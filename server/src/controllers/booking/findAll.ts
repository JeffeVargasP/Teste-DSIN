import express, { Express, Request, Response } from 'express';
import { database } from "../../../database";

export const findAll = async (req: Request, res: Response): Promise<any> => {

    const bookings = await database.booking.findMany();

    if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'Bookings not found' });
    }

    res.status(200).json(bookings);

}