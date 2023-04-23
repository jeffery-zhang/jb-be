import { hashSync } from 'bcrypt'

export const encryptPassword = async (password: string) =>
  hashSync(password, 10)
