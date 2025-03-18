import express, { Request, Response } from 'express';
import { database } from "../../../database";

export const findDay = async (req: Request, res: Response): Promise<any> => {
    const rawDate = req.params.date;
    const dateObj = new Date(rawDate);
    dateObj.setDate(dateObj.getDate() + 1);
    const date = dateObj.toISOString().split('T')[0];

    const bookings = await database.booking.findMany({
        where: { date }
    });

    return res.status(200).json(bookings);
} 