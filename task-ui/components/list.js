import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
// import { useRouter } from "next/navigation";
import Button from "./UI/Button";

const List = ({ listItem, listKey, addTask, boardId }) => {
  const [input, setInput] = useState("");
  return (
    <div className="w-[300px]">
      <Droppable droppableId={`${listKey}`}>
        {(provided, snapshot) => (
          <div className="bg-blue-500 rounded m-3">
            {listItem && listItem.length > 0 && <div className="p-3 text-lg capitalize bg-gray-200 text-gray-900 rounded-t">{listItem[0].list_title}</div>}
            <div ref={provided.innerRef} className={"pt-1"}>
              {listItem &&
                listItem.length > 0 &&
                listItem?.map((taskItem, i) => (
                  <Draggable
                    key={taskItem?.id}
                    draggableId={taskItem?.id.toString()}
                    index={i}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="px-2 py-1"
                        // style={getItemStyle(
                        //   snapshot.isDragging,
                        //   provided.draggableProps.style
                        // )}
                      >
                        <TaskCard taskData={taskItem} />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
            <div className="flex p-2">
              <input
                className="outline-none rounded text-black p-2"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              <Button
                btnType={"primary"}
                extraClasses="flex-1 ml-1 p-2 text-sm"
                onClickHandler={() => {
                  addTask(listKey, { title: input });
                  setInput("");
                }}
              >
                Create
              </Button>
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default List;

const grid = 8;
export const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: "4px",
  margin: `0 0 0 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

export const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  width: 250,
});
