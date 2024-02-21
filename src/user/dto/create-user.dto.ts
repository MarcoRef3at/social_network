import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserInterface } from '../interface/user.interface';

export class CreateUserDto implements UserInterface {
  @ApiProperty({
    required: true,
    nullable: false,
    description: "The user's name",
    example: 'Alice Norton',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;
}
