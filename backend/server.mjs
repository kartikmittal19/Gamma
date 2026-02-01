import express from "express"; 
import { route as newuser } from "./routes/newuser.mjs";
import { route as login } from "./routes/login.mjs";
import cookieParser from "cookie-parser";
const app = express();

const PORT = 3000

app.use(express.json());
app.use(cookieParser());
app.use('/',newuser);
app.use('/',login)
app.listen(PORT,()=>{
    console.log(`Server is running on Port: ${PORT}`);
})
