import {
  IsString,
  IsEmail,
  IsOptional,
  NotContains,
  MinLength,
  MaxLength,
  Validate,
} from 'class-validator'

import { IsValidRoleArray } from 'src/roles/role.validator'
import { Role } from '../../roles/role.enum'

export class UpdateDto {
  @IsOptional()
  @IsString()
  @NotContains('@')
  public readonly username?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @MinLength(6)
  public readonly password?: string

  @IsOptional()
  @IsEmail()
  public readonly mail?: string

  @IsOptional()
  @IsString()
  public readonly avatar?: string

  @IsOptional()
  @Validate(IsValidRoleArray)
  public readonly roles?: Role[]
}
