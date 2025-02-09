import { GetSortOrderAPIFn, Order, Sort } from '../types/types';

const getSortOrderAPI: GetSortOrderAPIFn = (sort: Sort, order: Order): string => {
  if (sort && order) {
    return `&_sort=${sort}&_order=${order}`;
  }
  return '';
};

export default getSortOrderAPI;
