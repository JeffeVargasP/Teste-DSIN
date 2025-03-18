import express, { Express, Request, Response } from 'express';
import { database } from "../../../database";

export const findOne = async (req: Request, res: Response): Promise<any> => {

    const findOne = await database.booking.findFirst({
        where: {
            id: Number(req.params.id)
        }
    });

    if (!findOne) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json(findOne);

}