import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserInterface } from 'src/user/interface/user.interface';

@Table({
  tableName: 'users',
})
export class User extends Model<User> implements UserInterface {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;
}
