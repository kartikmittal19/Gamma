import { Router } from "express";
import { tracemiddlware } from "../middleware/tracemiddleware.mjs";

export const route = Router();

route.get('/dummy',tracemiddlware,(req,res)=>{
    res.status(200).json({
        message: "heelo "
    });
})