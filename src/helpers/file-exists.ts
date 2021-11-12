import { stat } from 'fs';
import { promisify } from 'util';

export async function fileExists(filename: string) {
  try {
    await promisify(stat)(filename);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    } else {
      throw err;
    }
  }
}
