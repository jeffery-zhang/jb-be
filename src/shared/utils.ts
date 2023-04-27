import { hashSync } from 'bcrypt'
import { ISearch } from './interfaces'

export const encryptPassword = async (password: string) =>
  hashSync(password, 10)

export const filterSearchParams = (params: ISearch) => {
  const conditions: any = {}
  const sorter: any = {}
  const pager: {
    page: number
    pageSize: number
  } = {
    page: 1,
    pageSize: 10,
  }

  Object.keys(params).forEach((key) => {
    switch (true) {
      case ['page', 'pageSize'].includes(key):
        pager[key] = params[key]
        break
      case key === 'sortBy':
        sorter[params[key]] = params['order'] || 'desc'
        break
      case key === 'keywords' || key === 'order':
        break
      default:
        conditions[key] = params[key]
    }
  })

  return { conditions, pager, sorter }
}
