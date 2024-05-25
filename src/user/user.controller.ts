import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  async createUser(
    @Body()
    createUserDto: {
      email: string;
      first_name: string;
      last_name: string;
      avatar: string;
    },
  ) {
    return this.userService.createUser(
      createUserDto.email,
      createUserDto.first_name,
      createUserDto.last_name,
      createUserDto.avatar,
    );
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Get('user/:id/avatar')
  // This id is of type string, since it is referring to the id of the user in the database, not in the URL
  async getAvatarById(@Param('id') id: string) {
    return this.userService.getAvatarById(id);
  }

  @Delete('user/:id/avatar')
  // This id is of type string, since it is referring to the id of the user in the database, not in the URL
  async deleteUserAvatar(@Param('id') id: string) {
    return this.userService.deleteUserAvatar(id);
  }
}
