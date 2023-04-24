import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

import { Role } from './role.enum'

@ValidatorConstraint()
export class IsValidRoleArray implements ValidatorConstraintInterface {
  validate(roles: Role[]): boolean {
    if (!Array.isArray(roles) || roles.length === 0) {
      return false
    }
    for (const role of roles) {
      if (role !== Role.Admin && role !== Role.User) {
        return false
      }
    }
    return true
  }

  defaultMessage(): string {
    return '请至少选择一个角色'
  }
}
