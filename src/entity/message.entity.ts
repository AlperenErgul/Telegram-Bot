import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
export class MessageEntity extends Model{

  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  id:number

  @Column(DataType.INTEGER)
  chatId:number

  @Column(DataType.STRING(255))
  message:string

}
