import { log } from '@repo/logger';
import { config } from 'dotenv';
import { SerialPort } from 'serialport';

config();

const serialPort: SerialPort = new SerialPort({
  path: process.env.MODEM_SERIAL_PORT_PATH || '/dev/ttyUSB0',
  baudRate: Number(process.env.MODEM_SERIAL_PORT_BAUD_RATE) || 9600
});

serialPort.on('error', (error) => {
  log(`Serial port error: ${error.message}`);
  process.exit(1);
});

const commands = ['AT+CCID'];

commands.forEach((command) => {
  serialPort.write(`${command}\r\n`, (error) => {
    if (error) log(`Failed to write command "${command}": ${error.message}`);
  });
});

let commandIndex = 0;
serialPort.on('data', (data) => {
  log(`[${commandIndex}] ${commands[commandIndex]}: ${String(data)}`);
  handleMessageReception(String(data));
  commandIndex++;
});

const isReceivedMessageCommand = (data: string) => data.startsWith('+CMT');
const handleMessageReception = (data: string) => {
  if (!isReceivedMessageCommand(data)) {
    return;
  }
};
