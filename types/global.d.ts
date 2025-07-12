import mongoose from 'mongoose';

declare global {
  var mongoose: any;
  
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      };
    }
  }
}

export {};