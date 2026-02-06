import { context, trace } from "@opentelemetry/api";

export const attachSessionToSpan = (req, res, next) => {
  const span = trace.getSpan(context.active());
  if (span && req.cookies.sessionId) {
    span.setAttribute("session_id", req.cookies.sessionId);
  }
  next();
};
