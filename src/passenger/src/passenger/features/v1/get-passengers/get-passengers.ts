import { Controller, Get, Query, Route, Security, SuccessResponse } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import Joi from 'joi';
import { PagedResult } from 'building-blocks/types/pagination/paged-result';
import { PassengerDto } from '../../../dtos/passenger.dto';
import { IPassengerRepository } from '../../../../data/repositories/passenger.repository';
import { Passenger } from '../../../entities/passenger.entity';
import mapper from '../../../mappings';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';

export class GetPassengers implements IRequest<PagedResult<PassengerDto[]>> {
  page = 1;
  pageSize = 10;
  orderBy = 'id';
  order: 'ASC' | 'DESC' = 'ASC';
  searchTerm?: string = null;

  constructor(request: Partial<GetPassengers> = {}) {
    Object.assign(this, request);
  }
}

const getPassengersValidations = Joi.object<GetPassengers>({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
  orderBy: Joi.string().valid('id', 'name', 'email').default('id'),
  order: Joi.string().valid('ASC', 'DESC').default('ASC'),
  searchTerm: Joi.string().allow(null).optional()
});

@Route('/api/v1/passenger')
export class GetPassengersController extends Controller {
  @Get('get-all')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  public async getPassengers(
    @Query() pageSize = 10,
    @Query() page = 1,
    @Query() order: 'ASC' | 'DESC' = 'ASC',
    @Query() orderBy = 'id',
    @Query() searchTerm?: string
  ): Promise<PassengerDto[]> {
    const result = await mediatrJs.send<PassengerDto[]>(
      new GetPassengers({
        page: page,
        pageSize: pageSize,
        searchTerm: searchTerm,
        order: order,
        orderBy: orderBy
      })
    );

    return result;
  }
}

@injectable()
export class GetPassengersHandler
  implements IRequestHandler<GetPassengers, PagedResult<PassengerDto[]>>
{
  constructor(@inject('IPassengerRepository') private passengerRepository: IPassengerRepository) {}

  async handle(request: GetPassengers): Promise<PagedResult<PassengerDto[]>> {
    await getPassengersValidations.validateAsync(request);

    const [passengersEntity, total] = await this.passengerRepository.findPassengers(
      request.page,
      request.pageSize,
      request.orderBy,
      request.order,
      request.searchTerm
    );

    if (passengersEntity?.length == 0) return new PagedResult<PassengerDto[]>(null, total);

    const result = passengersEntity.map((user) =>
      mapper.map<Passenger, PassengerDto>(user, new PassengerDto())
    );

    return new PagedResult<PassengerDto[]>(result, total);
  }
}
