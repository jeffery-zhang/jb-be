import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator'

export class SettingDto {
  @IsNotEmpty()
  @IsString()
  userId: string

  @IsString()
  banner: string

  @IsString()
  theme: string

  @IsInt()
  @Max(3)
  @Min(0)
  rounded: 0 | 1 | 2 | 3
}
