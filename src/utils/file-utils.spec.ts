import * as fs from 'fs';
import axios from 'axios';
import * as crypto from 'crypto';
import { hashAndSave } from './file-utils';
import * as path from 'path';

jest.mock('axios');
jest.mock('fs');
jest.mock('crypto');

describe('hashAndSave', () => {
  it('should hash and save the image', async () => {
    const mockUrl = 'http://example.com/image.jpg';
    const mockImageData = Buffer.from('test image data');
    const mockHash = 'testhash';
    const mockFilePath = path.join(
      __dirname,
      '../../media/avatars',
      `${mockHash}.jpg`,
    );

    (axios.get as jest.Mock).mockResolvedValue({ data: mockImageData });
    (crypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(mockHash),
    });

    await hashAndSave(mockUrl);

    expect(axios.get).toHaveBeenCalledWith(mockUrl, {
      responseType: 'arraybuffer',
    });
    expect(fs.writeFileSync).toHaveBeenCalledWith(mockFilePath, mockImageData);
  });
});
