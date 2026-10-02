import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import net from 'net';
import path from 'path';

// In the container, node runs as PID 1, where the kernel ignores any signal the
// process has not installed a handler for. Without one, SIGTERM did nothing and
// every old pod sat out Knative's full 300s grace period before being
// SIGKILLed. Here the server is a child process rather than PID 1, so a missing
// handler shows up differently - the process dies *by* the signal (code null)
// instead of exiting cleanly - but it is the same missing handler either way.

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const { port } = srv.address() as net.AddressInfo;
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

describe('graceful shutdown', () => {
  it('exits cleanly on SIGTERM instead of being killed by it', async () => {
    const port = await freePort();
    const child = spawn(
      process.execPath,
      ['--import', 'tsx', path.join(__dirname, '..', 'src', 'server.ts')],
      { env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] }
    );

    let output = '';
    child.stdout.on('data', (d) => (output += d));
    child.stderr.on('data', (d) => (output += d));

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`server never started:\n${output}`)), 10_000);
      child.stdout.on('data', () => {
        if (output.includes('listening')) {
          clearTimeout(timer);
          resolve();
        }
      });
    });

    const started = Date.now();
    child.kill('SIGTERM');
    const [code, signal] = await new Promise<[number | null, NodeJS.Signals | null]>((resolve) =>
      child.on('exit', (c, s) => resolve([c, s]))
    );

    expect({ code, signal }).toEqual({ code: 0, signal: null });
    expect(Date.now() - started).toBeLessThan(5_000);
    expect(output).toContain('shutting down');
  }, 20_000);
});
