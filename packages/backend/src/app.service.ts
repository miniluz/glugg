import { Injectable } from '@nestjs/common';
import { ZodTest } from '@glugg/shared';

@Injectable()
export class AppService {
  getHello(): ZodTest {
    return 'Hello World!';
  }
}
