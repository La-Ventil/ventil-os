// import { createServer } from "./server";
// import { log } from "@repo/logger";
//
// const port = process.env.PORT || 3001;
// const server = createServer();
//
// server.listen(port, () => {
//   log(`api running on ${port}`);
// });


import { SerialPort } from 'serialport'
import { config } from 'dotenv'

config();

const serialPort = new SerialPort({
  path: process.env.MODEM_SERIAL_PORT_PATH,
  baudRate: Number(process.env.MODEM_SERIAL_PORT_BAUD_RATE) || 9600
});

const commands = [
    'AT',
    'AT',
    'AT+CCID',
    'AT',
    'AT+CCID',
    'AT',
]

commands.forEach(command => {
  serialPort.write(`${command}\r\n`)
})

let commandIndex = 0;
serialPort.on('data', (data) => {
  console.log(commandIndex);
  console.log(commands[commandIndex]);
  console.log(String(data));
  // console.log(JSON.stringify(data));

  commandIndex++;
});