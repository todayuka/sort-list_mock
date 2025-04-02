import React, { MouseEventHandler, useCallback } from "react";
import { Button } from "./components/ui/button";
import SubItem from "./SubItem";
import { ListItem as ListItemType, SubItem as SubItemType } from "./type";

type ListItemProps = {
  item: ListItemType;
  sortable: boolean;
  dragEnterId: number | null;
  draggedParentId: number | null;
  onDragStart: (
    e: React.DragEvent<HTMLElement>,
    id: number,
    parentId: number | null
  ) => void;
  onDragOver: React.DragEventHandler<HTMLElement>;
  onDrop: (
    e: React.DragEvent<HTMLElement>,
    id: number,
    parentId: number | null
  ) => void;
  onDragEnter: (
    e: React.DragEvent<HTMLElement>,
    id: number,
    parentId: number | null
  ) => void;
  handleOpenSub: (
    id: number,
    parentId: number | null
  ) => MouseEventHandler<HTMLButtonElement>;
  handleInputChange: (id: number, value: string) => void;
  inputValues: Record<number, string>;
  switchSortable: (isSortButton: boolean) => void;
};

const ListItem: React.FC<ListItemProps> = ({
  item,
  sortable,
  dragEnterId,
  draggedParentId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnter,
  handleOpenSub,
  handleInputChange,
  inputValues,
  switchSortable,
}) => {
  // useCallbackを使用して関数をメモ化
  const handleOpenSubClick = useCallback(
    () => handleOpenSub(item.order, null)(),
    [item.order, handleOpenSub]
  );

  return (
    <li
      key={item.order}
      id={`${item.category}_${item.order}`}
      draggable={sortable}
      onDragStart={(e) => onDragStart(e, item.order, null)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, item.order, null)}
      onDragEnter={(e) => onDragEnter(e, item.order, null)}
      className={`border p-2 mb-2 ${
        dragEnterId === item.order && draggedParentId === null ? "ring-8" : ""
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
              className={item.isOpen ? "bg-purple-600" : "bg-red-600"}
              onClick={handleOpenSubClick} // メモ化した関数を使用
            >
              {item.isOpen ? "close" : "open"}
            </Button>
          </span>
        )}
      </div>
      {item.subCategory && (
        <div
          style={{
            display: item.isOpen ? "block" : "none",
          }}
          className="pl-10"
        >
          <ul>
            {item.subCategory.map((sub: SubItemType) => (
              <SubItem
                key={sub.order}
                sub={sub}
                parentId={item.order}
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
        </div>
      )}
      <input
        className="text-blue-500"
        type="text"
        value={inputValues[item.order]}
        onChange={(e) => handleInputChange(item.order, e.target.value)}
      />
    </li>
  );
};

export default ListItem;
