import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv"
import { pool } from "../db/postgre.mjs";
dotenv.config();
import { Router } from "express";
import { tracemiddlware } from "../middleware/tracemiddleware.mjs";
export const route = Router();

route.post('/login',tracemiddlware,async(req,res)=>{
    try{
    console.log('traceId:', req.traceId);
    console.log('spanId:', req.spanId);

    const {password,emailId} = req.body;
    const queryres = await pool.query('SELECT * FROM users WHERE email = $1', [emailId]);
    
    if (queryres.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const user = queryres.rows[0];
    const result = await bcrypt.compare(password,user.password_hash);
    if(!result){
        return res.status(400).json({message : "invalid credentials"});
    }
    var token = jwt.sign({ userId : user.id , email: user.email}, process.env.SECRET_KEY, {expiresIn: '24h'});
    res.cookie("token", token, {
        httpOnly: true,
      maxAge: 24*60*60*1000
    });
    res.status(200).json({
        message: "login successful"
    })
}catch(err){
    console.log(err);
    return res.status(401).json({
        message: "error occured in login process"
    })
}
})
