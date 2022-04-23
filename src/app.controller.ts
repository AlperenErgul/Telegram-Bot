import { Body, Controller, Get, Post, OnApplicationBootstrap } from "@nestjs/common";
import { MessageEntity } from "./entity/message.entity";
import { Telegraf } from "telegraf";
import * as _ from "lodash";


@Controller()
export class AppController implements OnApplicationBootstrap {

  private ctx = "a";


  onApplicationBootstrap() {

    const bot = new Telegraf("YOUR TELEGRAM BOT TOKEN");

    bot.on("message", (c) => {
      console.log("Asd");
      // @ts-ignore
      this.ctx = c;
    });
    bot.launch();


    setInterval(async () => {

      let chatIDS: any = [];
      let messages = await MessageEntity.findAll({ where: {} });

      if (messages.length > 0) {

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
            where: {
              chatId: chatIDS[a]
            }
          });


          let chatId_ = x[0].chatId;
          let message_ = "";

          for (let e = 0; e < x.length; e++) {
            message_ = message_ + " " + x[e].message;
          }

          let message_length1 = message_.length;
          let message_length2 = message_.length;
          let divideByTwo = 0;
          while (message_length1 > 4094) {
            message_length1 = message_length1 / 2;
            divideByTwo++;
          }
          let howMuchParts = divideByTwo * 2;

          if (howMuchParts != 0) {
            let lenghtOfTheMsgSend = message_length2 / howMuchParts;
            console.log(message_length2);

            lenghtOfTheMsgSend = Math.ceil(lenghtOfTheMsgSend);

            for (let z = 1; z <= howMuchParts; z++) {
              if (z == howMuchParts) {
                let shortMessage = message_.slice(lenghtOfTheMsgSend * z - lenghtOfTheMsgSend, lenghtOfTheMsgSend * z + 1);
                console.log("send message");
                // @ts-ignore
                await this.ctx.telegram.sendMessage(chatId_, shortMessage);
                continue;
              }
              let shortMessage = message_.slice(lenghtOfTheMsgSend * z - lenghtOfTheMsgSend, lenghtOfTheMsgSend * z);
              console.log("send message");
              // @ts-ignore
              await this.ctx.telegram.sendMessage(chatId_, shortMessage);
            }
            continue;
          }

          console.log("send message");
          // @ts-ignore
          await this.ctx.telegram.sendMessage(chatId_, message_);
        }
      }
    }, 10000);

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

    // const bot = new Telegraf("5334252288:AAEGXhEiNhoHmIGfh5Z0SGBJXfNBUHUYZms");
    //
    // bot.on("message", (c) => {
    //   console.log("Asd");
    //   // @ts-ignore
    //   this.ctx = c;
    // });
    // bot.launch();
    //
    //
    // setInterval(async () => {
    //
    //   let chatIDS: any = [];
    //   let messages = await MessageEntity.findAll({ where: {} });
    //
    //   for (let i = 0; i < messages.length; i++) {
    //     chatIDS.push(messages[i].chatId);
    //   }
    //
    //   chatIDS = _.sortedUniq(chatIDS);
    //
    //   for (let a = 0; a < chatIDS.length; a++) {
    //
    //     let x = await MessageEntity.findAll({
    //       where: {
    //         chatId: chatIDS[a]
    //       }
    //     });
    //
    //     await MessageEntity.destroy({
    //       where:{
    //         chatId:chatIDS[a]
    //       }
    //     });
    //
    //     let chatId_ = x[0].chatId;
    //     let message_ = "";
    //
    //     for (let e = 0; e < x.length; e++) {
    //       message_ = message_ + " " + x[e].message;
    //     }
    //
    //     let message_length = message_.length;
    //     let divideByTwo = 0;
    //     while (message_length > 4094) {
    //       message_length = message_length / 2;
    //       divideByTwo++;
    //     }
    //     let howMuchParts = divideByTwo * 2;
    //
    //     if (howMuchParts != 0) {
    //       let lenghtOfTheMsgSend = message_length / howMuchParts;
    //       for (let z = 1; z <= howMuchParts; z++) {
    //         if(z == howMuchParts){
    //           message_.slice(lenghtOfTheMsgSend * z - lenghtOfTheMsgSend, lenghtOfTheMsgSend * z + 1);
    //           continue;
    //         }
    //         message_.slice(lenghtOfTheMsgSend * z - lenghtOfTheMsgSend, lenghtOfTheMsgSend * z);
    //       }
    //       continue;
    //     }
    //
    //     console.log("send message");
    //     // @ts-ignore
    //     await this.ctx.telegram.sendMessage(chatId_, message_);
    //   }
    // }, 10000);
  }
}

// -622058869
//-753821905
// 1586190312
