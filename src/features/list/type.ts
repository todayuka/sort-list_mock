export type SubItem = {
  order: number;
  item: string;
  isOpen: boolean;
};

export type ListItem = {
  order: number;
  category: string;
  subCategory: SubItem[] | null;
  isOpen: boolean;
};
