export type Dict<K extends string | number | symbol, V> = {
  [key in K]: V;
};
