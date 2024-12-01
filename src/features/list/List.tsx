import React, { useState, MouseEventHandler } from "react";
import ListData from "./ListData";
import ListItem from "./ListItem";
import { ListItem as ListItemType } from "./type";

export const List = () => {
  // ソートボタン
  const [sortable, setSortable] = useState<boolean>(false);
  // 掴んでいるリストの id
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  // ドラッグ領域（掴んでいるリストの親要素）の id
  const [draggedParentId, setDraggedParentId] = useState<number | null>(null);
  // 順序管理のためのリストデータ
  const [listOrder, setListOrder] = useState<ListItemType[]>(ListData);
  const [dragEnterId, setDragEnterId] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<Record<number, string>>(
    ListData.reduce((acc, item) => {
      acc[item.order] = String(item.order);
      if (item.subCategory) {
        item.subCategory.forEach((sub) => {
          acc[sub.order] = String(sub.order);
        });
      }
      return acc;
    }, {} as Record<number, string>)
  );

  // アコーディオンの開閉制御
  const handleOpenSub = (
    id: number,
    parentId: number | null = null
  ): MouseEventHandler<HTMLButtonElement> => {
    return () => {
      setListOrder((prevListOrder) => {
        const newListOrder = [...prevListOrder];
        if (parentId === null) {
          const itemIndex = newListOrder.findIndex((item) => item.order === id);
          newListOrder[itemIndex].isOpen = !newListOrder[itemIndex].isOpen;
        } else {
          const parentIndex = newListOrder.findIndex(
            (item) => item.order === parentId
          );
          const subItemIndex = newListOrder[parentIndex].subCategory!.findIndex(
            (sub) => sub.order === id
          );
          newListOrder[parentIndex].subCategory![subItemIndex].isOpen =
            !newListOrder[parentIndex].subCategory![subItemIndex].isOpen;
        }
        return newListOrder;
      });
    };
  };

  // ソートボタンを掴んだ時のみドラッグを可能にする
  const switchSortable = (isSortButton: boolean) => {
    setSortable(isSortButton);
  };

  // ドラッグ開始時の処理
  const onDragStart = (
    e: React.DragEvent<HTMLElement>,
    id: number,
    parentId: number | null = null
  ) => {
    e.stopPropagation();
    setDraggedItemId(id);
    setDraggedParentId(parentId);
    e.dataTransfer.setData("text/plain", String(id));
  };

  // ドラッグオーバー時の処理
  const onDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // ドラッグエンター時の処理
  const onDragEnter = (
    e: React.DragEvent<HTMLElement>,
    enterId: number,
    dragEnterParentId: number | null = null
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragEnterParentId === draggedParentId) {
      setDragEnterId(enterId);
    } else {
      setDragEnterId(null);
    }
  };

  // ドロップ時の処理
  const onDrop = (
    e: React.DragEvent<HTMLElement>,
    dropId: number,
    dropParentId: number | null = null
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItemId === null || draggedParentId !== dropParentId) return;

    const updatedOrder = [...listOrder];

    if (dropParentId === null) {
      const draggedIndex = updatedOrder.findIndex(
        (item) => item.order === draggedItemId
      );
      const dropIndex = updatedOrder.findIndex((item) => item.order === dropId);

      const [draggedItem] = updatedOrder.splice(draggedIndex, 1);
      updatedOrder.splice(dropIndex, 0, draggedItem);

      updatedOrder.forEach((item, index) => {
        item.order = index;
      });
    } else {
      const parentIndex = updatedOrder.findIndex(
        (item) => item.order === dropParentId
      );
      const subCategoryList = updatedOrder[parentIndex].subCategory || [];

      const draggedIndex = subCategoryList.findIndex(
        (sub) => sub.order === draggedItemId
      );
      const dropIndex = subCategoryList.findIndex(
        (sub) => sub.order === dropId
      );

      const [draggedSubItem] = subCategoryList.splice(draggedIndex, 1);
      subCategoryList.splice(dropIndex, 0, draggedSubItem);

      updatedOrder[parentIndex].subCategory = subCategoryList;
      updatedOrder[parentIndex].subCategory?.forEach((sub, index) => {
        sub.order = index;
      });
    }

    setListOrder(updatedOrder);

    const newInputValues: Record<number, string> = {};
    updatedOrder.forEach((item) => {
      newInputValues[item.order] = String(item.order);
      if (item.subCategory) {
        item.subCategory.forEach((sub) => {
          newInputValues[sub.order] = String(sub.order);
        });
      }
    });
    setInputValues(newInputValues);

    setDraggedItemId(null);
    setDraggedParentId(null);
    setDragEnterId(null);
  };

  // 入力値の変更処理
  const handleInputChange = (id: number, value: string) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };

  return (
    <>
      <ul>
        {listOrder.map((item) => (
          <ListItem
            key={item.order}
            item={item}
            sortable={sortable}
            dragEnterId={dragEnterId}
            draggedParentId={draggedParentId}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            handleOpenSub={handleOpenSub}
            handleInputChange={handleInputChange}
            inputValues={inputValues}
            switchSortable={switchSortable}
          />
        ))}
      </ul>
    </>
  );
};

export default List;
