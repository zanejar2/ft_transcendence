import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

// ...

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: `http://${process.env.URI}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  
  const config = new DocumentBuilder()
    .setTitle('TRNSCENDANCE_ALI')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('ENDPOINT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
