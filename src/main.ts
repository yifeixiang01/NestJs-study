// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/exceptions/base.exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { generateDocument } from './doc';

declare const module: any;

async function bootstrap() {
  

  if(module.hot){
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  generateDocument(app)

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [VERSION_NEUTRAL, '1', '2']
  })

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
