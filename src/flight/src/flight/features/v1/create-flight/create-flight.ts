import { Body, Controller, Post, Route, Security, SuccessResponse } from 'tsoa';
import httpStatus from 'http-status';
import Joi from 'joi';
import ConflictException from 'building-blocks/types/exception/conflict.exception';
import { inject, injectable } from 'tsyringe';
import { FlightCreated } from 'building-blocks/contracts/flight.contract';
import { FlightStatus } from '../../../enums/flight-status.enum';
import { FlightDto } from '../../../dtos/flight.dto';
import { IFlightRepository } from '../../../../data/repositories/flight.repository';
import { Flight } from '../../../entities/flight.entity';
import { IPublisher } from 'building-blocks/rabbitmq/rabbitmq-publisher';
import mapper from '../../../mappings';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';

export class CreateFlight implements IRequest<CreateFlight> {
  flightNumber: string;
  price: number;
  flightStatus: FlightStatus;
  flightDate: Date;
  departureDate: Date;
  departureAirportId: number;
  aircraftId: number;
  arriveDate: Date;
  arriveAirportId: number;
  durationMinutes: number;

  constructor(request: Partial<CreateFlight> = {}) {
    Object.assign(this, request);
  }
}

export class CreateFlightRequestDto {
  flightNumber: string;
  price: number;
  flightStatus: FlightStatus;
  flightDate: Date;
  departureDate: Date;
  departureAirportId: number;
  aircraftId: number;
  arriveDate: Date;
  arriveAirportId: number;
  durationMinutes: number;

  constructor(request: Partial<CreateFlightRequestDto> = {}) {
    Object.assign(this, request);
  }
}

const createFlightValidations = Joi.object({
  flightNumber: Joi.string().required(),
  price: Joi.number().required(),
  flightStatus: Joi.string()
    .required()
    .valid(
      FlightStatus.UNKNOWN,
      FlightStatus.DELAY,
      FlightStatus.CANCELED,
      FlightStatus.FLYING,
      FlightStatus.COMPLETED
    ),
  flightDate: Joi.date().required(),
  departureDate: Joi.date().required(),
  departureAirportId: Joi.number().required(),
  aircraftId: Joi.number().required(),
  arriveDate: Joi.date().required(),
  arriveAirportId: Joi.number().required(),
  durationMinutes: Joi.number().required()
});

@Route('/api/v1/flight')
export class CreateFlightController extends Controller {
  @Post('create')
  @Security('jwt')
  @SuccessResponse('201', 'CREATED')
  public async createFlight(@Body() request: CreateFlightRequestDto): Promise<FlightDto> {
    const result = await mediatrJs.send<FlightDto>(
      new CreateFlight({
        flightNumber: request.flightNumber,
        aircraftId: request.aircraftId,
        arriveAirportId: request.arriveAirportId,
        arriveDate: request.arriveDate,
        price: request.price,
        departureAirportId: request.departureAirportId,
        departureDate: request.departureDate,
        flightDate: request.flightDate,
        flightStatus: request.flightStatus,
        durationMinutes: request.durationMinutes
      })
    );

    this.setStatus(httpStatus.CREATED);
    return result;
  }
}

@injectable()
export class CreateFlightHandler implements IRequestHandler<CreateFlight, FlightDto> {
  constructor(
    @inject('IPublisher') private publisher: IPublisher,
    @inject('IFlightRepository') private flightRepository: IFlightRepository
  ) {}

  async handle(request: CreateFlight): Promise<FlightDto> {
    await createFlightValidations.validateAsync(request);

    const existFlight = await this.flightRepository.findFlightByNumber(request.flightNumber);

    if (existFlight) {
      throw new ConflictException('Flight already taken');
    }

    const flightEntity = await this.flightRepository.createFlight(
      new Flight({
        flightNumber: request.flightNumber,
        aircraftId: request.aircraftId,
        arriveAirportId: request.arriveAirportId,
        arriveDate: request.arriveDate,
        price: request.price,
        departureAirportId: request.departureAirportId,
        departureDate: request.departureDate,
        flightDate: request.flightDate,
        flightStatus: request.flightStatus,
        durationMinutes: request.durationMinutes
      })
    );

    await this.publisher.publishMessage(new FlightCreated(flightEntity));

    const result = mapper.map<Flight, FlightDto>(flightEntity, new FlightDto());

    return result;
  }
}
