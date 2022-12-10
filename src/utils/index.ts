import { AxiosError } from 'axios';
import fs from 'fs';

export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const reportError = (e: any, msg: string) => {
  console.error(`==== ERROR ====`);
  if (e instanceof AxiosError) {
    console.error('status: ', e.status);
    console.error('message: ', e.message);
    console.error('data: ', e.response?.data);
  } else {
    console.error(e);
  }
  console.error(msg);
  console.error(`===============`);

  fs.appendFileSync('./errors.txt', `[${new Date().toISOString()}] ${msg}\n`);
};

export { parseDate } from './parseDate';
