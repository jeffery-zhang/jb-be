import { ISearch } from '../../shared/interfaces'

export interface ISearchPostParams extends ISearch {
  author?: string
  category?: string
  tags?: string
  sortBy?: Sorter
}

export type Sorter = 'createTime' | 'updateTime' | 'like' | 'pv'
