// import { createServer } from "./server";
// import { log } from "@repo/logger";
//
// const port = process.env.PORT || 3001;
// const server = createServer();
//
// server.listen(port, () => {
//   log(`api running on ${port}`);
// });

import { config } from "dotenv";
import { SerialPort } from "serialport";

config();

export const serialPort = new SerialPort({
  path: process.env.MODEM_SERIAL_PORT_PATH || "/dev/ttyUSB0",
  baudRate: Number(process.env.MODEM_SERIAL_PORT_BAUD_RATE) || 9600,
});

const commands = [
  // 'ATE1',
  // 'AT',
  // 'AT',
  "AT+CCID",
  // 'AT',
  // 'AT+CCID',
  // 'AT',
];

commands.forEach((command) => {
  serialPort.write(`${command}\r\n`);
});

let commandIndex = 0;
serialPort.on("data", (data) => {
  // console.log(commandIndex);
  // console.log(commands[commandIndex]);
  console.log(String(data));
  // console.log(JSON.stringify(data));
  handleMessageReception(String(data));

  commandIndex++;
});

// bool isERROR(int modemData) {
//     return String(modemData) === "ERROR";
// }
// bool isSMS(int modemData) {
//     return String(modemData).startsWith("+CMT:")
// }

const isReceivedMessageCommand = (data: string) => data.startsWith("+CMT");
const handleMessageReception = (data: string) => {
  if (!isReceivedMessageCommand(data)) {
    return;
  }
};
