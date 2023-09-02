import { db } from './initPolybase';

export const getPolybaseInstance = () => {
  return db;
};
