import { ReadlineParser, SerialPort } from 'serialport';

export class Modem {
  private serialPort: SerialPort;

  constructor(serialPort: SerialPort) {
    this.serialPort = serialPort;
  }

  connect() {
    return new Promise<void>((resolve, reject) => {
      this.serialPort.on('open', () => resolve());
      this.serialPort.on('error', (error) => reject(error));
    });
  }

  disconnect() {
    return new Promise<void>((resolve, reject) => {
      this.serialPort.close((error) => (error ? reject(error) : resolve()));
    });
  }

  at(
    command: string,
    options?: { lineEnd?: string; readTimeoutMs?: number; readUntil?: string }
  ) {
    const lineEnd = options?.lineEnd ?? '\r';
    const readUntil = options?.readUntil;
    const readTimeoutMs = options?.readTimeoutMs ?? 1000;

    return new Promise<string>((resolve, reject) => {
      const parser = this.serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
      const result: string[] = [];

      const cleanup = () => {
        parser.removeListener('data', onData);
        parser.removeListener('error', onError);
        this.serialPort.unpipe(parser);
      };

      const onError = (error: unknown) => {
        cleanup();
        reject(error);
      };

      const onData = (chunk: string) => {
        result.push(chunk);
        const trimmed = chunk.trim();
        if (readUntil && trimmed === readUntil) {
          cleanup();
          resolve(result.join('\n'));
          return;
        }
        if (!readUntil && (trimmed === 'OK' || trimmed === 'ERROR')) {
          cleanup();
          resolve(result.join('\n'));
        }
      };

      parser.on('data', onData);
      parser.on('error', onError);

      this.serialPort.write(`${command}${lineEnd}`, (error) => {
        if (error) {
          cleanup();
          reject(error);
          return;
        }

        this.serialPort.drain((drainError) => {
          if (drainError) {
            cleanup();
            reject(drainError);
            return;
          }

          if (!readUntil) {
            setTimeout(() => {
              cleanup();
              resolve(result.join('\n'));
            }, readTimeoutMs);
          }
        });
      });
    });
  }
}
