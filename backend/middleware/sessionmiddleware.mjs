import express from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const sessionmiddleware=async(req,res,next)=>{
    try{
        const {sessionId} = req.cookies.sessionId;
        if(!sessionId){
            return res.status(400).json({
                message: "no session ID here "
            })
        };
        const decoded = jwt.verify(sessionId,process.env.SESSION_SECRET_KEY);
        req.session = decoded;
        next();

    }catch(err){
        return res.status(500).json(err);
    }
}