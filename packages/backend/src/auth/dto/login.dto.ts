import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Token ID do Firebase' })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}