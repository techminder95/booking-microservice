import { Controller, Get, Query, Route, Security, SuccessResponse } from 'tsoa';
import Joi from 'joi';
import NotFoundException from 'building-blocks/types/exception/not-found.exception';
import { inject, injectable } from 'tsyringe';
import { PassengerDto } from '../../../dtos/passenger.dto';
import { IPassengerRepository } from '../../../../data/repositories/passenger.repository';
import { Passenger } from '../../../entities/passenger.entity';
import mapper from '../../../mappings';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';

export class GetPassengerById implements IRequest<PassengerDto> {
  id: number;

  constructor(request: Partial<GetPassengerById> = {}) {
    Object.assign(this, request);
  }
}

const getPassengerByIdValidations = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

@Route('/api/v1/passenger')
export class GetPassengerByIdController extends Controller {
  @Get('get-by-id')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  public async getPassengerById(@Query() id: number): Promise<PassengerDto> {
    const result = await mediatrJs.send<PassengerDto>(
      new GetPassengerById({
        id: id
      })
    );

    if (!result) {
      throw new NotFoundException('Passenger not found');
    }
    return result;
  }
}

@injectable()
export class GetPassengerByIdHandler implements IRequestHandler<GetPassengerById, PassengerDto> {
  constructor(@inject('IPassengerRepository') private passengerRepository: IPassengerRepository) {}

  async handle(request: GetPassengerById): Promise<PassengerDto> {
    await getPassengerByIdValidations.params.validateAsync(request);

    const passengerEntity = await this.passengerRepository.findPassengerById(request.id);

    const result = mapper.map<Passenger, PassengerDto>(passengerEntity, new PassengerDto());

    return result;
  }
}
