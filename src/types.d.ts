
import { Request } from 'express';

declare namespace Express {
  export interface Request {
    user: any;
    login: (user: any, done: (err: any) => void) => void;
  }
  export interface Response {
    user: any;
  }
}
