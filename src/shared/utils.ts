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
    skipCount: number
  } = {
    page: 1,
    pageSize: 10,
    skipCount: 0,
  }

  Object.keys(params).forEach((key) => {
    switch (true) {
      case ['page', 'pageSize'].includes(key):
        pager[key] = parseInt(params[key])
        break
      case key === 'sortBy':
        if (params[key]) sorter[params[key]] = params['order'] || 'desc'
        break
      case key === 'keywords' || key === 'order':
        break
      default:
        if (params[key]) conditions[key] = params[key]
    }
  })

  pager.skipCount = (pager.page - 1) * pager.pageSize

  return { conditions, pager, sorter }
}

export const updatePostContentImage = async (
  content: string,
  regexp: RegExp,
  update: (url: string, bucket?: string) => Promise<string>,
  bucket: string,
) => {
  const matches = [...content.matchAll(regexp)]
  const newVals = await Promise.all(
    matches.map(async (match) => {
      return await update(match[2], bucket)
    }),
  )
  let contentCopy = content.slice()
  matches.forEach((match, index) => {
    contentCopy = contentCopy.replace(match[2], newVals[index])
  })

  return contentCopy
}
