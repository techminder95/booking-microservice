import { Controller, Get, Query, Route, Security, SuccessResponse } from 'tsoa';
import Joi from 'joi';
import NotFoundException from 'building-blocks/types/exception/not-found.exception';
import { inject, injectable } from 'tsyringe';
import { UserDto } from '../../../dtos/user.dto';
import { IUserRepository } from '../../../../data/repositories/user.repository';
import { User } from '../../../entities/user.entity';
import mapper from '../../../mapping';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';

export class GetUserById implements IRequest<UserDto> {
  id: number;

  constructor(request: Partial<GetUserById> = {}) {
    Object.assign(this, request);
  }
}

const getUserByIdValidations = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

@Route('/api/v1/user')
export class GetUserByIdController extends Controller {
  @Get('get-by-id')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  public async getUserById(@Query() id: number): Promise<UserDto> {
    const result = await mediatrJs.send<UserDto>(
      new GetUserById({
        id: id
      })
    );

    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }
}

@injectable()
export class GetUserByIdHandler implements IRequestHandler<GetUserById, UserDto> {
  constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}
  async handle(request: GetUserById): Promise<UserDto> {
    await getUserByIdValidations.params.validateAsync(request);

    const usersEntity = await this.userRepository.findUserById(request.id);

    const result = mapper.map<User, UserDto>(usersEntity, new UserDto());

    return result;
  }
}
