import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    required: true,
    nullable: false,
    description: 'User ID',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'Post String Data',
    example: 'Hello World!',
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    required: false,
    nullable: false,
    description: 'Post Visibility',
    example: 'private',
  })
  @IsOptional()
  @IsEnum(['public', 'private'])
  @IsString()
  visibility: 'public' | 'private' = 'public';
}
