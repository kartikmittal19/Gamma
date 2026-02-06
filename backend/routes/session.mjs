import { Router } from "express";
import { authmiddleware } from "../middleware/authmiddleware.mjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { context, trace } from "@opentelemetry/api";

dotenv.config();
export const route = Router();

route.post("/session", authmiddleware, (req, res) => {

    const rawSessionId = uuidv4();
    const sessionId = jwt.sign(rawSessionId, process.env.SESSION_SECRET_KEY);

    const span = trace.getSpan(context.active());
    if (span) {
        span.setAttribute("session_id", sessionId);
        span.setAttribute("event", "session_created");
    }

    res.cookie("sessionId", sessionId, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });

    res.status(200).json({
        message: "sessionId generated",
    });
});
