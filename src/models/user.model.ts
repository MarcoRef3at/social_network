import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserFollows } from './userFollows.model';
import { UserFriends } from './userFriends.model';
import { Post } from './post.model';
import { Like } from './like.model';

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

  @BelongsToMany(() => User, () => UserFriends, 'userId', 'friendId')
  friends: User[];

  @HasMany(() => Post)
  posts: Post[];

  @BelongsToMany(() => Post, () => Like)
  likedPosts: Post[];
}
