import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import * as fs from 'fs';
import { User } from './user/dto/user.req.dto';
import { join } from 'path';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = async (req, file, cb) => {
  try
  {
    const user: User = req.user;
    const ext = file.originalname.split('.')[1];
    const Name = `${user.login}.${ext}`;
    const path = join(process.cwd(), './uploads', Name);

    if (file.size > 1024 * 1024) {
      return cb(new HttpException('File too large', HttpStatus.BAD_REQUEST), '');
    }
    if (await fs.existsSync(path)) {
      await fs.unlinkSync(path);
    }
  
    return cb(null, Name);
  }
  catch (e)
  {
    console.log("Error in editFileName");
  }
};
