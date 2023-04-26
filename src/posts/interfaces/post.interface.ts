import { ISearch } from '../../shared/interfaces'

export interface ISearchParams extends ISearch {
  author?: string
  category?: string
  tag?: string
  sortBy?: Sorter
}

export type Sorter = 'createTime' | 'updateTime' | 'like' | 'pv'
