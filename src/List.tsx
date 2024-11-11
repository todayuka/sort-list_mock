import ListData from "./ListData";
import { Button } from "./components/ui/button";
import { MouseEventHandler, useState } from "react";

export const List = () => {
  // アコーディオンが開いているアイテム (Map に変更して id をキーとして状態を保持)
  const [openItems, setOpenItems] = useState<Map<number, boolean>>(new Map());
  // ソートボタン
  const [sortable, setSortable] = useState<boolean>(false);
  // 掴んでいるリストの id
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  // ドラッグ領域（掴んでいるリストの親要素）の id
  const [draggedParentId, setDraggedParentId] = useState<number | null>(null);
  // 順序管理のためのリストデータ
  const [listOrder, setListOrder] = useState(ListData);
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
  const handleOpenSub = (id: number): MouseEventHandler<HTMLButtonElement> => {
    return () => {
      setOpenItems((prevOpenItems) => {
        const newOpenItems = new Map(prevOpenItems);
        // 現在の状態を反転させる
        newOpenItems.set(id, !newOpenItems.get(id));
        return newOpenItems;
      });
    };
  };

  // ソートボタンを掴んだ時のみドラッグを可能にする
  const switchSortable = (isSortButton: boolean) => {
    setSortable(isSortButton);
  };

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

  const onDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

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
          <li
            key={item.order}
            id={`${item.category}_${item.order}`}
            draggable={sortable}
            onDragStart={(e) => onDragStart(e, item.order)}
            onDragOver={(e) => onDragOver(e)}
            onDrop={(e) => onDrop(e, item.order)}
            onDragEnter={(e) => onDragEnter(e, item.order, null)}
            className={`border p-2 mb-2 ${
              dragEnterId === item.order && draggedParentId === null
                ? "ring-8"
                : ""
            }`}
          >
            <div className="py-2 flex gap-2 items-center">
              <span>
                <Button
                  onMouseEnter={() => switchSortable(true)}
                  onMouseLeave={() => switchSortable(false)}
                  className="bg-blue-600 cursor-move"
                >
                  sort
                </Button>
              </span>
              {item.category}
              {item.subCategory && (
                <span>
                  <Button
                    className={
                      openItems.get(item.order) ? "bg-purple-600" : "bg-red-600"
                    }
                    onClick={handleOpenSub(item.order)}
                  >
                    {openItems.get(item.order) ? "close" : "open"}
                  </Button>
                </span>
              )}
            </div>
            {item.subCategory && (
              <div
                style={{
                  display: openItems.get(item.order) ? "block" : "none",
                }}
                className="pl-10"
              >
                <ul>
                  {item.subCategory.map((sub) => (
                    <li
                      key={sub.order}
                      id={`${sub.item}_${sub.order}`}
                      draggable={sortable}
                      onDragStart={(e) => onDragStart(e, sub.order, item.order)}
                      onDragOver={(e) => onDragOver(e)}
                      onDrop={(e) => onDrop(e, sub.order, item.order)}
                      onDragEnter={(e) => onDragEnter(e, sub.order, item.order)}
                      className={`border p-2 mb-2 ${
                        dragEnterId === sub.order &&
                        draggedParentId === item.order
                          ? "ring-8"
                          : ""
                      }`}
                    >
                      <div className="py-2 flex gap-2 items-center">
                        <span>
                          <Button
                            onMouseEnter={() => switchSortable(true)}
                            onMouseLeave={() => switchSortable(false)}
                            className="bg-green-500 cursor-move"
                          >
                            sort
                          </Button>
                        </span>
                        {sub.item}
                      </div>
                      <input
                        className="text-green-500"
                        type="text"
                        value={inputValues[sub.order]}
                        onChange={(e) =>
                          handleInputChange(sub.order, e.target.value)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <input
              className="text-blue-500"
              type="text"
              value={inputValues[item.order]}
              onChange={(e) => handleInputChange(item.order, e.target.value)}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default List;
