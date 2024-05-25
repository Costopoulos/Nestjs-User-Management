import * as fs from 'fs';
import axios from 'axios';
import * as crypto from 'crypto';
import * as path from 'node:path';

export async function hashAndSave(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  // Generate the MD5 hash of the image data
  const fileHash = crypto.createHash('md5').update(response.data).digest('hex');
  const filePath = path.join(
    __dirname,
    '../../media/avatars',
    `${fileHash}.jpg`,
  );
  // Save the image to the file system
  fs.writeFileSync(filePath, response.data);
  return fileHash;
}
