import express, { Request, Response } from 'express';
import { database } from "../../../database";

export const findHistory = async (req: Request, res: Response): Promise<any> => {
    const userId = Number(req.params.userId);
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const bookings = await database.booking.findMany({
        where: {
            userId,
            date: {
                gte: startDate.toString(),
                lte: endDate.toString()
            }
        },
        orderBy: {
            date: 'desc'
        }
    });

    return res.status(200).json(bookings);
} 