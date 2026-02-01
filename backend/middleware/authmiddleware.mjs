import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
import { pool } from "../db/postgre.mjs";

export const authmiddleware=async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message : "no token unauthorised access"});
    try{

        const decoded =  jwt.verify(token,process.env.SECRET_KEY );
        const result = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [decoded.userId]
        );
        if(result.rows.length == 0){
            return res.json({message: "new user click on new "});
        }
        req.user = result.rows[0];
        next();
    }catch(err){
        return res.status(401).json({
            message : "unauthorised access expired token"
        })
    }
}