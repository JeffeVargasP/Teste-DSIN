import express, { Router, Request, Response } from "express";
import { database } from "../../../database";

export const remove = async (req: Request, res: Response): Promise<any> => {
    const id = Number(req.params.id);

    const removeBooking = await database.booking.delete({
        where: { id },
    });

    if (!removeBooking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json(removeBooking);
}