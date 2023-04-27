export interface ISearch {
  keywords?: string
  keywordsKeys?: string[]
  sortBy?: string
  order?: 'desc' | 'asc'
  page?: number
  pageSize?: number
}

export interface IReponseRecords<T = any> {
  page: number
  pageSize: number
  total: number
  records: T[]
}
