import { Controller, Get, Query, Route, Security, SuccessResponse } from 'tsoa';
import Joi from 'joi';
import NotFoundException from 'building-blocks/types/exception/not-found.exception';
import { inject, injectable } from 'tsyringe';
import { FlightDto } from '../../../dtos/flight.dto';
import { IFlightRepository } from '../../../../data/repositories/flight.repository';
import { Flight } from '../../../entities/flight.entity';
import mapper from '../../../mappings';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';

export class GetFlightById implements IRequest<FlightDto> {
  id: number;

  constructor(request: Partial<GetFlightById> = {}) {
    Object.assign(this, request);
  }
}

const getFlightByIdValidations = {
  params: Joi.object().keys({
    id: Joi.number().required()
  })
};

@Route('/api/v1/flight')
export class GetUserByIdController extends Controller {
  @Get('get-by-id')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  public async getFlightById(@Query() id: number): Promise<FlightDto> {
    const result = await mediatrJs.send<FlightDto>(
      new GetFlightById({
        id: id
      })
    );

    if (!result) {
      throw new NotFoundException('Flight not found');
    }
    return result;
  }
}

@injectable()
export class GetFlightByIdHandler implements IRequestHandler<GetFlightById, FlightDto> {
  constructor(@inject('IFlightRepository') private flightRepository: IFlightRepository) {}
  async handle(request: GetFlightById): Promise<FlightDto> {
    await getFlightByIdValidations.params.validateAsync(request);

    const flightEntity = await this.flightRepository.findFlightById(request.id);

    const result = mapper.map<Flight, FlightDto>(flightEntity, new FlightDto());

    return result;
  }
}
