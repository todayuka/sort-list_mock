import ListData from "./ListData";
import { Button } from "./components/ui/button";
import { MouseEventHandler, useState } from "react";

export const List = () => {
  // アコーディオンが開いてるアイテム
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  // ソートボタン
  const [sortable, setSortable] = useState<boolean>(false);
  // 掴んでるリストのid
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  // ドラッグ領域(掴んでるリストの親要素)のid
  const [draggedParentId, setDraggedParentId] = useState<number | null>(null);
  const [listOrder, setListOrder] = useState(ListData);
  const [dragEnterId, setDragEnterId] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<Record<number, string>>(
    // inputの値 -> ListDataのorderの値を文字列で保存
    ListData.reduce((acc, item) => {
      acc[item.order] = String(item.order);
      if (item.subCategory) {
        item.subCategory.forEach((sub) => {
          // サブカテゴリのorderの値も保存
          acc[sub.order] = String(sub.order);
        });
      }
      return acc;
      // ↓ex.){1:"1" }※初期値は空
    }, {} as Record<number, string>)
  );

  // アコーディオンの制御
  const handleOpenSub = (id: number): MouseEventHandler<HTMLButtonElement> => {
    // 以下関数が発火
    return () => {
      setOpenItems((prevOpenItems) => {
        const newOpenItems = new Set(prevOpenItems);
        // idが付与されていないリストはid(＝orderの値)を内部的に付与/既にある場合は削除
        // -> JSX上でidの有無でUIを制御
        newOpenItems.has(id) ? newOpenItems.delete(id) : newOpenItems.add(id);
        // 現在開いているアコーディオン項目のidのSetオブジェクト(×not配列)
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
    //同じドラッグ領域の要素に重なった時に.ringクラスを追加
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
    const updatedOpenItems = new Set(openItems);

    if (dropParentId === null) {
      const draggedIndex = updatedOrder.findIndex(
        (item) => item.order === draggedItemId
      );
      const dropIndex = updatedOrder.findIndex((item) => item.order === dropId);

      const [draggedItem] = updatedOrder.splice(draggedIndex, 1);
      updatedOrder.splice(dropIndex, 0, draggedItem);

      // 新しいorderを設定しつつ、openItemsも更新(該当のアコーディオン開きアイテムを保持)
      updatedOrder.forEach((item, index) => {
        const wasOpen = openItems.has(item.order);
        item.order = index;
        // 順序変更後も開閉状態を保持
        if (wasOpen) {
          updatedOpenItems.add(index);
        } else {
          updatedOpenItems.delete(index);
        }
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

      // 新しいorderを設定しつつ、openItemsも更新
      updatedOrder[parentIndex].subCategory = subCategoryList;
      updatedOrder[parentIndex].subCategory?.forEach((sub, index) => {
        const wasOpen = openItems.has(sub.order);
        sub.order = index;
        if (wasOpen) {
          updatedOpenItems.add(index);
        } else {
          updatedOpenItems.delete(index);
        }
      });
    }

    // 更新したリストと開閉状態を設定
    setListOrder(updatedOrder);
    setOpenItems(updatedOpenItems);

    // 該当のアイテムのinputの値（順番）をorderに基づいて内部的に更新
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

    // ドラッグイベント時に使用したidをnullにする
    setDraggedItemId(null);
    setDraggedParentId(null);
    setDragEnterId(null);
  };

  // 並べ替え後のinputの値
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
