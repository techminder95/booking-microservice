import { container } from 'tsyringe';
import { CreateUser, CreateUserHandler } from '../user/features/v1/createUser';
import { mediatrJs } from 'building-blocks/mediatr-js/mediatr.js';
import { DeleteUserById, DeleteUserByIdHandler } from '../user/features/v1/deleteUserById';
import { GetUserById, GetUserByIdHandler } from '../user/features/v1/getUserById';
import { GetUsers, GetUsersHandler } from '../user/features/v1/getUsers';
import { UpdateUser, UpdateUserHandler } from '../user/features/v1/updateUser';
import { GenerateToken, GenerateTokenHandler } from '../auth/features/v1/generateToken';
import { ValidateToken, ValidateTokenHandler } from '../auth/features/v1/validateToken';
import { Login, LoginHandler } from '../auth/features/v1/login';
import { Logout, LogoutHandler } from '../auth/features/v1/logout';
import { RefreshToken, RefreshTokenHandler } from '../auth/features/v1/refreshToken';

export const registerMediatrHandlers = () => {
  mediatrJs.registerHandler(CreateUser, container.resolve(CreateUserHandler));
  mediatrJs.registerHandler(DeleteUserById, container.resolve(DeleteUserByIdHandler));
  mediatrJs.registerHandler(GetUserById, container.resolve(GetUserByIdHandler));
  mediatrJs.registerHandler(GetUsers, container.resolve(GetUsersHandler));
  mediatrJs.registerHandler(UpdateUser, container.resolve(UpdateUserHandler));
  mediatrJs.registerHandler(GenerateToken, container.resolve(GenerateTokenHandler));
  mediatrJs.registerHandler(ValidateToken, container.resolve(ValidateTokenHandler));
  mediatrJs.registerHandler(Login, container.resolve(LoginHandler));
  mediatrJs.registerHandler(Logout, container.resolve(LogoutHandler));
  mediatrJs.registerHandler(RefreshToken, container.resolve(RefreshTokenHandler));
};