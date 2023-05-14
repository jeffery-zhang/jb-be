import { IsNotEmpty, IsString } from 'class-validator'

export class BannerDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  bannerUrl: string
}
