type SubItem = {
  order: number;
  item: string;
};

type ListItem = {
  order: number;
  category: string;
  subCategory: SubItem[] | null;
};

export const ListData: ListItem[] = [
  {
    order: 0,
    category: "カテゴリA",
    subCategory: [
      { order: 0, item: "サブカテゴリa" },
      { order: 1, item: "サブカテゴリb" },
      { order: 2, item: "サブカテゴリc" },
    ],
  },
  {
    order: 1,
    category: "カテゴリB",
    subCategory: [
      { order: 0, item: "サブカテゴリd" },
      { order: 1, item: "サブカテゴリe" },
    ],
  },
  {
    order: 2,
    category: "カテゴリC",
    subCategory: null,
  },
  {
    order: 3,
    category: "カテゴリD",
    subCategory: [
      { order: 0, item: "サブカテゴリf" },
      { order: 1, item: "サブカテゴリg" },
    ],
  },
];

export default ListData;
