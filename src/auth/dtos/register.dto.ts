import {
  IsString,
  IsNotEmpty,
  IsEmail,
  NotContains,
  MinLength,
  MaxLength,
  Validate,
} from 'class-validator'

import { IsValidRoleArray } from '../../roles/role.validator'
import { Role } from '../../roles/role.enum'

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(2)
  @NotContains('@')
  public readonly username: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(6)
  public readonly password: string

  @IsEmail()
  @IsNotEmpty()
  public readonly mail: string

  @IsString()
  public readonly avatar: string

  @Validate(IsValidRoleArray)
  public readonly roles: Role[]
}
