import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Like } from './like.model';

@Table({
  tableName: 'posts',
})
export class Post extends Model<Post> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  likesCount: number;

  @Column({
    type: DataType.ENUM,
    values: ['public', 'private'],
    allowNull: false,
  })
  visibility: 'public' | 'private';

  @BelongsTo(() => User)
  user: User;

  @BelongsToMany(() => User, () => Like)
  likers: User[];
}
