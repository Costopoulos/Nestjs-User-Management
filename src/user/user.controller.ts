import {Body, Controller, Delete, Get, Param, Post} from "@nestjs/common";
import {UserService} from "./user.service";

@Controller('api/')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post('users')
    async createUser(@Body() createUserDto: { email: string, firstName: string, lastName: string, avatar: string }) {
        return this.userService.createUser(
            createUserDto.email,
            createUserDto.firstName,
            createUserDto.lastName,
            createUserDto.avatar
        );
    }

    @Get('user/:id')
    async getUserById(@Param('id') id: number){
        return this.userService.getUserById(id);
    }

    // @Get('user/:id/avatar')
    // async deleteUserAvatar(@Param('id') id: number){
    //     return this.userService.deleteUserAvatar(id);
    // }

    // @Delete('user/:id/avatar')
    // async deleteUserAvatar(@Param('id') id: number){
    //     return this.userService.deleteUserAvatar(id);
    // }
}