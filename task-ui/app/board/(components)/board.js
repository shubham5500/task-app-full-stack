"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BASE_URL, customFetch, getHeaders } from "@/utils/helper";

import List from "@/components/list";
import { isEmpty } from "lodash";

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

async function callMoveApi(payload) {
  return await customFetch(`/tasks/move`, "PUT", payload);
}
// assuming List component is imported

const Board = () => {
  const [lists, setLists] = useState({});
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

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
      const res = await customFetch("/tasks", "GET");
      setLists({
        ...lists,
        ...normalizeList(res),
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callGetAllTasks();
  }, []);

  const getItems = async () => {
    const results = await customFetch("/tasks");
    setLists(normalizeList(results));
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.index === destination.index) {
      return;
    }
    const items = move(source, destination);

    const payload = getTaskMovePayload(items);
    const updatedTaks = await callMoveApi(payload);
    setLists({
      ...normalizeList(updatedTaks),
    });
    // const reorder = (listId, startIndex, endIndex) => {
    //   const listsCopy = { ...lists }; // create a shallow copy of the state
    //   const [removed] = listsCopy[listId].splice(startIndex, 1);
    //   listsCopy[listId].splice(endIndex, 0, removed);
    //   return listsCopy;
    // };

    // const items = reorder(
    //   source.droppableId,
    //   source.index,
    //   destination.index
    // );
    // const result = move(source, destination);

    // const payload = getTaskMovePayload(result);
    // const updatedTaks = await callMoveApi(payload);
    // setLists({
    //   ...normalizeList(updatedTaks),
    // });
  };

  const addTask = async (listKey, payload) => {
    const { title } = payload;
    await fetch(`${BASE_URL}/tasks/create`, {
      ...getHeaders("POST"),
      body: JSON.stringify({
        title: title,
        description: "task description 2",
        status: "pending",
        priority: "medium",
        createdBy: 3,
        assignedTo: 23,
        listId: listKey,
      }),
    });
    getItems();
  };

  if (isEmpty(lists)) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.keys(lists).map((key) => (
          <List
            key={key}
            listItem={lists[key]}
            listKey={key}
            addTask={addTask}
          />
        ))}
      </DragDropContext>
    </div>
  );
};

export default Board;
