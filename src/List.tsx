import ListData from "./ListData";
import { Button } from "./components/ui/button";
import { MouseEventHandler, useState } from "react";

export const List = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [sortable, setSortable] = useState<boolean>(false);
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  const [draggedParentId, setDraggedParentId] = useState<number | null>(null);
  const [listOrder, setListOrder] = useState(ListData);
  const [dragEnterId, setDragEnterId] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<Record<number, string>>(
    ListData.reduce((acc, item) => {
      // 入力値を文字列で保存
      acc[item.order] = String(item.order);
      if (item.subCategory) {
        item.subCategory.forEach((sub) => {
          // サブカテゴリの入力値も保存
          acc[sub.order] = String(sub.order);
        });
      }
      return acc;
    }, {} as Record<number, string>)
  );

  // アコーディオン
  const handleOpenSub = (id: number): MouseEventHandler<HTMLButtonElement> => {
    return () => {
      setOpenItems((prevOpenItems) => {
        const newOpenItems = new Set(prevOpenItems);
        newOpenItems.has(id) ? newOpenItems.delete(id) : newOpenItems.add(id);
        return newOpenItems;
      });
    };
  };

  // sortボタンを掴んだ時のみドラッグを可能にする
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

  // onDragOverイベントを無効にすることでonDragEnterを有効にする
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
    //同じドラッグ領域の要素に重なった時に.ringを追加
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

      // 新しいorderを設定
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

      //新しいorderを設定
      updatedOrder[parentIndex].subCategory = subCategoryList;
      updatedOrder[parentIndex].subCategory?.forEach((sub, index) => {
        sub.order = index;
      });
    }

    // リストの順序を更新
    setListOrder(updatedOrder);

    // 入力値を更新するための新しいオブジェクトを生成
    const newInputValues: Record<number, string> = {};
    updatedOrder.forEach((item) => {
      newInputValues[item.order] = String(item.order);
      if (item.subCategory) {
        item.subCategory.forEach((sub) => {
          newInputValues[sub.order] = String(sub.order);
        });
      }
    });
    // 状態を更新
    setInputValues(newInputValues);

    setDraggedItemId(null);
    setDraggedParentId(null);
    setDragEnterId(null);
  };

  // inputの値
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
            onDragEnter={(e) => onDragEnter(e, item.order, null)} // 親要素のドラッグエンター
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
                      openItems.has(item.order) ? "bg-purple-600" : "bg-red-600"
                    }
                    onClick={handleOpenSub(item.order)}
                  >
                    {openItems.has(item.order) ? "close" : "open"}
                  </Button>
                </span>
              )}
            </div>
            {item.subCategory && (
              <div
                className={openItems.has(item.order) ? "pl-10" : "pl-10 hidden"}
              >
                <ul>
                  {item.subCategory.map((sub) => (
                    <li
                      key={sub.order}
                      id={`${sub.item}_${sub.order}`}
                      draggable={sortable}
                      onDragStart={(e) => onDragStart(e, sub.order, item.order)} // 親IDを渡す
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
                        value={inputValues[sub.order]} // 入力値をstateから取得
                        onChange={(e) =>
                          handleInputChange(sub.order, e.target.value)
                        } // 状態を更新
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <input
              className="text-blue-500"
              type="text"
              value={inputValues[item.order]} // 入力値をstateから取得
              onChange={(e) => handleInputChange(item.order, e.target.value)} // 状態を更新
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default List;
