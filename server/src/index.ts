import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { config } from '../config';
import cors from 'cors';

import { userRoutes } from './routes/user';
import { bookingRoutes } from './routes/booking';

const app: Express = express();
const { serverPort } = config;

app.use(cors({
    origin: '*',
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is running"
    });
});

app.use("/user", userRoutes);
app.use("/bookings", bookingRoutes);

app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}`);
});