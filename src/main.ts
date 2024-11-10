import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DataProcessorService } from "./shared/data-processor.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataProcessorService = app.get(DataProcessorService);
  dataProcessorService.startPeriodicProcessing();
  await app.listen(3000);
}
bootstrap();
