import { ListItem } from "./type";

export const ListData: ListItem[] = [
  {
    order: 0,
    category: "カテゴリA",
    isOpen: false,
    subCategory: [
      { order: 0, item: "サブカテゴリa", isOpen: false },
      { order: 1, item: "サブカテゴリb", isOpen: false },
      { order: 2, item: "サブカテゴリc", isOpen: false },
    ],
  },
  {
    order: 1,
    category: "カテゴリB",
    isOpen: false,
    subCategory: [
      { order: 0, item: "サブカテゴリd", isOpen: false },
      { order: 1, item: "サブカテゴリe", isOpen: false },
    ],
  },
  {
    order: 2,
    category: "カテゴリC",
    isOpen: false,
    subCategory: null,
  },
  {
    order: 3,
    category: "カテゴリD",
    isOpen: false,
    subCategory: [
      { order: 0, item: "サブカテゴリf", isOpen: false },
      { order: 1, item: "サブカテゴリg", isOpen: false },
    ],
  },
];

export default ListData;
