import express from "express"
import { Router } from "express"

export const route = Router();

route.post('/event',(req,res)=>{
    const { sessionId,eventType,target,timestamp,metadata } = req.body;
    
});