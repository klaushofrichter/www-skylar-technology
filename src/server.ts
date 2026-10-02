import { createApp } from './app';

const port = Number(process.env.PORT) || 8080;

/** Longest a shutdown may wait for in-flight requests; well under Knative's 300s grace. */
const SHUTDOWN_TIMEOUT_MS = 10_000;

const app = createApp();
const server = app.listen(port, () => {
  console.log(`www-skylar-technology listening on port ${port}`);
});

// In the container node is PID 1, and the kernel ignores any signal PID 1 has
// not installed a handler for. Without this, SIGTERM did nothing: every old
// pod sat out Knative's full 300s termination grace period on each deploy and
// was then SIGKILLed. By the time SIGTERM arrives Knative's queue-proxy has
// already drained traffic, so closing is quick; the timer only bounds a
// request that hangs.
function shutdown(signal: NodeJS.Signals): void {
  console.log(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
  // close() waits for open keep-alive sockets too; idle ones carry no request.
  server.closeIdleConnections();
  setTimeout(() => {
    console.error(`still shutting down after ${SHUTDOWN_TIMEOUT_MS}ms, forcing exit`);
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();
}

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
