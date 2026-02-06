import express from "express";
import { Router } from "express";
import { sessionmiddleware } from "../middleware/sessionmiddleware.mjs";
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("frontend-events");

export const route = Router();

route.post('/events',sessionmiddleware,async(req,res)=>
    {
    const span = tracer.startSpan("frontend.event");
    span.setAttribute("session_id",req.cookies.sessionId);
    span.setAttribute("event.type", req.body.eventType);
    span.setAttribute("event.action", req.body.action);
    span.setAttribute("event.screen", req.body.screen);

    span.end();
    res.sendStatus(200);

}

)