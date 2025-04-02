import React, { MouseEventHandler, useCallback } from "react";
import { Button } from "./components/ui/button";
import { SubItem as SubItemType } from "./type";

type SubItemProps = {
  sub: SubItemType;
  parentId: number;
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

const SubItem: React.FC<SubItemProps> = ({
  sub,
  parentId,
  sortable,
  dragEnterId,
  draggedParentId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnter,
  handleInputChange,
  inputValues,
  switchSortable,
}) => {
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLElement>) => onDragStart(e, sub.order, parentId),
    [onDragStart, sub.order, parentId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => onDrop(e, sub.order, parentId),
    [onDrop, sub.order, parentId]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLElement>) => onDragEnter(e, sub.order, parentId),
    [onDragEnter, sub.order, parentId]
  );

  return (
    <li
      key={sub.order}
      id={`${sub.item}_${sub.order}`}
      draggable={sortable}
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      className={`border p-2 mb-2 ${
        dragEnterId === sub.order && draggedParentId === parentId
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
        onChange={(e) => handleInputChange(sub.order, e.target.value)}
      />
    </li>
  );
};

export default SubItem;
