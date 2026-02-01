
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv"
dotenv.config();
import { Router } from "express";
import { pool } from "../db/postgre.mjs";
export const route = Router();

route.post('/newuser',async(req,res)=>{
    try{
        const {emailId,username, password} = req.body;
        const hashedpassword = await bcrypt.hash(password,10);
        const result = await pool.query(
        `INSERT INTO users (email, username, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id`,
        [emailId, username, hashedpassword]
        );
        var token = jwt.sign(
            {
                userId : result.rows[0].id,
                email : emailId
            }
            ,process.env.SECRET_KEY,{expiresIn: '1h'});
        res.cookie("token",token,
            {
                maxAge : 1000*24*60*60
            }
        )
        return res.status(201).json({
            message : "user created successfully",
        });
    }catch(err){
        console.error(err);
        res.status(500).json("user creation failed error");
    }
})