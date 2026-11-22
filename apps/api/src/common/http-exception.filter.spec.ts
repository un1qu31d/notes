import {
  ArgumentsHost,
  BadRequestException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

function hostWith(res: object): ArgumentsHost {
  return { switchToHttp: () => ({ getResponse: () => res }) } as unknown as ArgumentsHost;
}

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();
  let res: { status: jest.Mock; json: jest.Mock };

  beforeEach(() => {
    res = { status: jest.fn(), json: jest.fn() };
    res.status.mockReturnValue(res);
  });

  it('passes through errors already in the API shape', () => {
    const body = { error: { code: 'invalid_credentials', message: 'Nope.' } };
    filter.catch(new UnauthorizedException(body), hostWith(res));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(body);
  });

  it('converts validation errors', () => {
    filter.catch(new BadRequestException(['email must be an email', 'password should not be empty']), hostWith(res));
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'validation_error', message: 'email must be an email; password should not be empty' },
    });
  });

  it('converts plain Nest errors', () => {
    filter.catch(new NotFoundException(), hostWith(res));
    expect(res.json).toHaveBeenCalledWith({ error: { code: 'not_found', message: 'Not Found' } });
  });

  it('hides details of unexpected errors', () => {
    const logError = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    filter.catch(new Error('secret internal detail'), hostWith(res));
    expect(logError).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: { code: 'internal_error', message: 'Something went wrong.' } });
  });
});
