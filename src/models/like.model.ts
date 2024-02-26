import {
  Model,
  Table,
  Column,
  ForeignKey,
  DataType,
  AfterCreate,
  AfterDestroy,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Post } from './post.model';

@Table({
  tableName: 'likes',
})
export class Like extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  postId: number;

  @AfterCreate
  static async incrementPostLikesCount(like: Like) {
    await Post.increment('likesCount', { by: 1, where: { id: like.postId } });
  }

  @AfterDestroy
  static async decrementPostLikesCount(like: Like) {
    await Post.decrement('likesCount', { by: 1, where: { id: like.postId } });
  }
}
