import { ISearch } from '../../shared/interfaces'

export interface ISearchCommentParams extends ISearch {
  userId?: string
  username?: string
  post?: string
  sortBy?: Sorter
}

export type Sorter = 'createTime' | 'updateTime' | 'like'
