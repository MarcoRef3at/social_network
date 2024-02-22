import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'user_friends',
})
export class UserFriends extends Model<UserFriends> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => User)
  @Column
  friendId: number;
}
