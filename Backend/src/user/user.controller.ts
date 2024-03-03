import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  UseGuards,
  Req,
  Res,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
// import { Request } from 'express';
import { UserService } from './user.service';
import { User } from './dto/user.req.dto';
import { jwtGuard } from 'src/auth/jwt/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Multer from 'multer';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { imageFileFilter, editFileName } from '../image.validator';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('/Users')
@UseGuards(jwtGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private prisma: PrismaService,
  ) {}

  @Post()
  createUser(@Body() user: User) {
    return this.userService.createUser(user);
  }

  @Get()
  findUsers() {
    return this.userService.findUsers();
  }

  @Get('profile/:login')
  findUser(@Param('login') login: string) {
    return this.userService.findUser(login);
  }

  @Patch(':login')
  updateUser(@Param('login') login: string, @Body() user: any) {
    
    return this.userService.updateUser(login, user);
  }

  @Delete()
  deleteUsers() {
    this.userService.deleteUsers();
  }

  @Delete(':login')
  deleteUser(@Param('login') login: string) {
    this.userService.deleteUser(login);
  }

  @Post('friends/:login')
  async addFriend(@Param('login') login: string, @Body() friend: any){

    await this.userService.addFriend(login, friend.friend);
  }

  @Delete('friends/:login')
  async deleteFriend(@Param('login') login: string, @Body() friend: any) {
    await this.userService.removeFriend(login, friend.friend);
  }

  @Post('block/:login')
  async addBlocked(@Param('login') login: string, @Body() blocked: any) {
    await this.userService.blockPlayer(login, blocked.blocked);
  }

  @Delete('block/:login')
  async deleteBlocked(@Param('login') login: string, @Body() blocked: any) {
    await this.userService.removeBlock(login, blocked.blocked);
  }

  @Get('relations/:login')
  async getRelations(@Param('login') login: string) {
    return await this.userService.getRelations(login);
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    const user = await this.userService.getProfile(req.user);
    return user;
  }
  @Get('history/:login')
  async history(@Param('login') login: string) {
    return await this.userService.getHistory(login);
  }

  @Post('avatars')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: Multer.diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file: any, @Req() req: any) {
    const path = 'http://' + process.env.NEST_APP_HOST + '/Users/avatars/' + file.filename;
    try {
      const user = await this.userService.updatePicture(req.user.login, path);
      if (file) {
        return path;
      } else {
        throw new HttpException('Image is required', HttpStatus.BAD_REQUEST);
      }
    }
    catch (e) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('avatars/:avatar')
  async getImage(@Param('avatar') avatar: string, @Res() res: Response) {
    try
    {
      const path = join(process.cwd(), './uploads', avatar);
      if (await fs.existsSync(path))
        res.sendFile(path);
      else
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
    catch (e)
    {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('logout')
  async logout(@Req() req: any, @Res() Res: Response) {
    Res.clearCookie('access_token');
    Res.status(200).send('Logged out');
  }
}