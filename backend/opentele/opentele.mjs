import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { CassandraSpanExporter } from "../db/cassandra.mjs";

const cassandraExporter = new CassandraSpanExporter();

const sdk = new NodeSDK({
  traceExporter: cassandraExporter,
  spanProcessor: new SimpleSpanProcessor(cassandraExporter),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
