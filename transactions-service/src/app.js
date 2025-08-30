import express from "express";
import 'dotenv/config';
import routes from "./routes/index.js";
import cors from "cors";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN_ALLOWED, credentials: true }));
app.use(express.json());
app.use('/', routes);

app.use((err, req, res, next) => {
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
        status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
        error: err.message || "Algo deu errado em sua solicitação.",
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

export default app;