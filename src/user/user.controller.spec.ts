import {Test, TestingModule} from '@nestjs/testing';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {NotFoundException} from '@nestjs/common';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    const mockUserService = {
        createUser: jest.fn(dto => ({
            _id: '1',
            ...dto,
        })),
        getUserById: jest.fn(id => {
            if (id === 1) {
                return {
                    _id: '1',
                    email: 'test@example.com',
                    first_name: 'Test',
                    last_name: 'User',
                    avatar: 'test.jpg',
                };
            } else {
                throw new NotFoundException('User not found');
            }
        }),
        getAvatarById: jest.fn().mockResolvedValue('base64image'),
        deleteUserAvatar: jest.fn().mockResolvedValue({message: 'Avatar successfully deleted'}),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createUser', () => {
        it('should return a user by id', async () => {
            const result = await controller.getUserById(1);
            expect(result).toEqual(expect.objectContaining({
                _id: '1',
                email: 'test@example.com',
                first_name: 'Test',
                last_name: 'User',
                avatar: 'test.jpg',
            }));
            expect(service.getUserById).toHaveBeenCalledWith(1); // Use number here
        });
    });

    describe('getUserById', () => {
        it('should return a user by id', async () => {
            try {
                const result = await controller.getUserById(1);
            } catch (error) {
                console.error(error);
            }
            expect(service.getUserById).toHaveBeenCalledWith(1); // Use number here
        });

        it('should throw NotFoundException if user not found', async () => {
            await expect(controller.getUserById(2)).rejects.toThrow('User not found');
        });
    });

    describe('getUserAvatar', () => {
        it('should return a base64-encoded avatar', async () => {
            expect(await controller.getAvatarById('1')).toEqual('base64image');
            expect(service.getAvatarById).toHaveBeenCalledWith('1');
        });
    });

    describe('deleteUserAvatar', () => {
        it('should delete a user avatar and return success message', async () => {
            expect(await controller.deleteUserAvatar('1')).toEqual({message: 'Avatar successfully deleted'});
            expect(service.deleteUserAvatar).toHaveBeenCalledWith('1');
        });
    });
});
