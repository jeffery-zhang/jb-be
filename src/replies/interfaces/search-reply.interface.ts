import { ISearch } from '../../shared/interfaces'

export interface ISearchReplyParams extends ISearch {
  userId?: string
  username?: string
  comment?: string
  sortBy?: Sorter
}

export type Sorter = 'createTime' | 'updateTime' | 'like'
