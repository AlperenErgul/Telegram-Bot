import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { MessageEntity } from "./entity/message.entity";

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect:"sqlite",
      storage: "db/db.sqlite3",
      autoLoadModels: true,
      synchronize: true
    }),
    SequelizeModule.forFeature([MessageEntity])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
