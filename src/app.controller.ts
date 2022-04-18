import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { MessageEntity } from "./entity/message.entity";
import { Telegraf } from "telegraf";
import * as _ from "lodash";


@Controller()
export class AppController {

  private ctx = "a";

  constructor(private readonly appService: AppService) {
  }

  @Post()
  async createMessage(@Body() body) {
    return await MessageEntity.create({
      chatId: body.chatId,
      message: body.message
    });
  }


  @Get()
  async sendMessage() {

    const bot = new Telegraf("5334252288:AAEGXhEiNhoHmIGfh5Z0SGBJXfNBUHUYZms");

    bot.on("message", (c) => {
      console.log("Asd");
      // @ts-ignore
      this.ctx = c;
    });
    bot.launch();


    setInterval(async () => {

      let chatIDS: any = [];
      let messages = await MessageEntity.findAll({ where: {} });

      for (let i = 0; i < messages.length; i++) {
        chatIDS.push(messages[i].chatId);
      }

      chatIDS = _.sortedUniq(chatIDS);

      for (let a = 0; a < chatIDS.length; a++) {

        let x = await MessageEntity.findAll({
          where: {
            chatId: chatIDS[a]
          }
        });

        await MessageEntity.destroy({
          where:{
            chatId:chatIDS[a]
          }
        });

        let chatId_ = x[0].chatId;
        let message_ = "";

        for (let e = 0; e < x.length; e++) {
          message_ = message_ + " " + x[e].message;
        }

        let message_length = message_.length;
        let divideByTwo = 0;
        while (message_length > 4094) {
          message_length = message_length / 2;
          divideByTwo++;
        }
        let howMuchParts = divideByTwo * 2;

        if (howMuchParts != 0) {
          let lenghtOfTheMsgSend = message_length / howMuchParts;
          for (let z = 1; z <= howMuchParts; z++) {
            if(z == howMuchParts){
              message_.slice(lenghtOfTheMsgSend * z - lenghtOfTheMsgSend, lenghtOfTheMsgSend * z + 1);
              continue;
            }
            message_.slice(lenghtOfTheMsgSend * z - lenghtOfTheMsgSend, lenghtOfTheMsgSend * z);
          }
          continue;
        }

        console.log("send message");
        // @ts-ignore
        await this.ctx.telegram.sendMessage(chatId_, message_);
      }
    }, 10000);
  }
}


