import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserFollows } from './userFollows.model';

@Table({
  tableName: 'users',
})
export class User extends Model<User> {
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

  @BelongsToMany(() => User, () => UserFollows, 'followerId', 'userId')
  followings: User[];

  @BelongsToMany(() => User, () => UserFollows, 'userId', 'followerId')
  followers: User[];
}
