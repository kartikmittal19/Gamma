import { context, trace } from "@opentelemetry/api";

export const tracemiddlware=async(req,res,next)=>{
    const span = trace.getSpan(context.active());
    if(span){
        const spanContext = span.spanContext();
        req.traceId = spanContext.traceId;
        req.spanId = spanContext.spanId;
    }
    next();
}