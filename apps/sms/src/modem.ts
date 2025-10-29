import {ReadlineParser, SerialPort} from "serialport";

export class Modem {
    private serialPort: SerialPort;
    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.serialPort.on('open', ()   =>  resolve());
            this.serialPort.on('error', e => reject(e));
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            this.serialPort.close(e => e ? reject(e) : resolve());
        });

    }

    at(command: string) {
        const parser = this.serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }))
        parser.on('data', console.log)
        return new Promise((resolve, reject) => {
            // we need this to measure time since last read to stop data waiting
            // when there are no more data
            let time = null;

            // read output
            let result = [];
            const reader = new ReadlineParser({ delimiter: '\r\n' });

            reader.on('data', chunk => {
                time = process.hrtime();
                result.push(chunk);

                // need to stop reading data
                if (read_until && chunk.trim() === read_until) {
                    this.port.unpipe();
                    resolve(result.join('\n'));
                }
            });

            this.port.pipe(reader);

            // send AT command
            this.port.write(`${command}${this.options.line_end}`, err => {
                if (err) return void reject(err);

                // wait until all data is transmitted to the serial port
                this.port.drain(err => {
                    if (!read_until) {
                        // stop if no data received from port for a long time
                        const interval = setInterval(
                            () => {
                                // no data read yet
                                if (time === null) return;

                                // calculate how much time lost sinse last data read
                                const diff = process.hrtime(time);
                                const diff_ms = diff[0] * 1000 + Math.round(diff[1] / 1000000);

                                // probably no more data
                                if (diff_ms > this.options.read_time) {
                                    clearInterval(interval);
                                    this.port.unpipe();
                                    resolve(result.join('\n'));
                                }
                            },
                            this.options.read_time
                        );
                    }
                });
            });
    }
}