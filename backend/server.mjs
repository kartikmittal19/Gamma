import './opentele/opentele.mjs'
import express from "express"; 
import { route as newuser } from "./routes/newuser.mjs";
import { route as login } from "./routes/login.mjs";
import { route as session } from './routes/session.mjs';
import { route as dummy } from './routes/dummy.mjs';
import cookieParser from "cookie-parser";
import { tracemiddlware } from "./middleware/tracemiddleware.mjs";
import { attachSessionToSpan } from './middleware/spantele.mjs';
import { frontcontextmiddleware } from './middleware/frontcontextmiddleware.mjs';
const app = express();

const PORT = 3000

app.use(express.json());
app.use(cookieParser());
app.use(tracemiddlware);
app.use(attachSessionToSpan);
app.use(frontcontextmiddleware);
app.use('/',newuser);
app.use('/',login);
app.use('/', session);
app.use('/',dummy);

app.listen(PORT,()=>{
    console.log(`Server is running on Port: ${PORT}`);
})
