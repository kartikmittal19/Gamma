import {context, trace} from "@opentelemetry/api"

export const frontcontextmiddleware=(req,res,next)=>{
    const span = trace.getSpan(context.active());
    if(span){
        const sessionId = req.cookies.sessionId;
        if(sessionId){
            span.setAttribute("session_id",sessionId);
        }

        span.setAttribute("frontend.path", req.originalUrl);
        span.setAttribute("frontend.method", req.method);
    }
    next();
}