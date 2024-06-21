"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BASE_URL, customFetch, getHeaders } from "@/utils/helper";

import List from "@/components/List";
import { isEmpty } from "lodash";
import Button from "@/components/UI/Button";
import { useParams } from "next/navigation";

function normalizeList(listData = []) {
  const obj = {};
  if (listData.length > 0) {
    listData.forEach((listItem) => {
      obj[listItem.list_id] = listItem.tasks.sort((a, b) => {
        return a.position - b.position;
      });
    });
  }
  return obj;
}

function getTaskMovePayload(lists) {
  const payload = {};
  Object.entries(lists).forEach(([key, value]) => {
    const list = lists[key];
    payload[key] = {};
    list.forEach((listItem, i) => {
      payload[key][listItem.id] = i;
    });
  });
  return payload;
}

async function callMoveApi(payload, boardId) {
  return await customFetch(`/tasks/${boardId}/move`, "PUT", payload);
}
// assuming List component is imported

const Board = () => {
  const [lists, setLists] = useState({});
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { boardId } = useParams();

  const move = (sou, des) => {
    const sourceDroppableId = sou.droppableId;
    const destinationDroppableId = des.droppableId;
    const movedItem = lists[sourceDroppableId].splice(sou.index, 1)[0];
    lists[destinationDroppableId].splice(des.index, 0, movedItem);

    return { ...lists }; // returning a new array reference
  };

  const callGetAllTasks = async () => {
    try {
      setLoading(true);
      const { result } = await customFetch("/tasks", "POST", {
        boardId,
      });
      setLists({
        ...lists,
        ...normalizeList(result),
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callGetAllTasks();
  }, []);

  const addList = async ({}) => {
    const { result } = await customFetch(`/lists/create`, "POST", {
      boardId,
      title: "new List",
    });
    setLists({
      ...lists,
      [result.id]: {
        id: result.id,
        title: result.title,
        tasks: [],
      },
    });
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    // if the position of the task is same as before then do nothing.
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const items = move(source, destination);

    const payload = getTaskMovePayload(items);
    const updatedTaks = await callMoveApi(payload, boardId);
    setLists({
      ...lists,
      ...normalizeList(updatedTaks),
    });
  };

  const addTask = async (listKey, payload) => {
    const { title } = payload;

    const result = await customFetch(`/tasks/create`, "POST", {
      title: title,
      description: "",
      status: "pending",
      priority: "medium",
      listId: parseInt(listKey),
    });
    console.log({ result, lists });
    // callGetAllTasks();
    setLists({
      ...lists,
      [listKey]: [...lists[listKey], {...result}],
    })
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isEmpty(lists)) {
    return (
      <div className="flex flex-col mt-3  ml-3">
        <button
          onClick={addList}
          className="w-[300px] p-4 bg-slate-100 border-dashed border-blue-500 border-2	 rounded text-black"
        >
          Add List
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.keys(lists).map((key) => (
          <List
            boardId={boardId}
            key={key}
            listItem={lists[key]}
            listKey={key}
            addTask={addTask}
          />
        ))}
        <div className="flex flex-col mt-3  ">
          <button
            onClick={addList}
            className="w-[300px] p-4 bg-slate-100 border-dashed border-blue-500 border-2	 rounded text-black"
          >
            Add List
          </button>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
