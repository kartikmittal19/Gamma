
import { Client } from "cassandra-driver";

const client = new Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1",
  keyspace: "casga",
});

export class CassandraSpanExporter {
  async export(spans, resultCallback) {
    try {
      if (!spans || spans.length === 0) return resultCallback({ code: 0 });

      const queries = spans.map(span => {
        const attrs = span.attributes || {};
        const sessionId = span.attributes?.session_id || span.spanContext().traceId;
        const eventTime = new Date(span.startTime[0] * 1000 + span.startTime[1] / 1e6);
        const eventType = "span";
        const source = "backend";
        const trace_Id = span.attributes?.trace_id || span.spanContext().traceId;
        const span_Id  = span.attributes?.span_id  || span.spanContext().spanId;
        const payload = JSON.stringify({
        spanName: span.name,               
        httpMethod: attrs["http.method"],
        httpRoute: attrs["http.route"],    
        httpTarget: attrs["http.target"],
        httpUrl: attrs["http.url"],
        status: span.status.code,
        endTime: new Date(
          span.endTime[0] * 1000 + span.endTime[1] / 1e6
        ),
      });

        return {
          query: `INSERT INTO events(session_id, event_time, event_type, source, trace_id, span_id, payload)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
          params: [sessionId, eventTime, eventType, source, trace_Id, span_Id, payload],
        };
      });

      await client.batch(queries, { prepare: true });

      resultCallback({ code: 0 });
    } catch (err) {
      console.error("Cassandra Export Error:", err);
      resultCallback({ code: 1 });
    }
  }

  shutdown() {
    return client.shutdown();
  }
}
