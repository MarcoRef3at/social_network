import { IsNotEmpty, IsString } from 'class-validator';
import { UserInterface } from '../interface/user.interface';

export class CreateUserDto implements UserInterface {
  @IsNotEmpty()
  @IsString()
  fullName: string;
}
