import { IsInt, IsString, Max, Min } from 'class-validator'

export class SettingDto {
  @IsString()
  banner: string

  @IsString()
  theme: string

  @IsInt()
  @Max(3)
  @Min(0)
  rounded: 0 | 1 | 2 | 3
}
