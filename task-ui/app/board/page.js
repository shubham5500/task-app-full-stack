"use client";
import React, { Component } from "react";
import { cloneDeep } from "lodash";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BASE_URL, customFetch, getHeaders } from "@/utils/helper";

import List from "@/components/list";

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
  await fetch(`${BASE_URL}/tasks/move`, {
    ...getHeaders(),
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

class Board extends Component {
  state = {
    lists: [],
    title: "",
  };

  move = (sou, des) => {
    const { lists } = this.state;
    const sourceDroppableId = sou.droppableId;
    const destinationDroppableId = des.droppableId;
    const [movedItem] = lists[sourceDroppableId].splice(sou.index, 1);
    lists[destinationDroppableId].splice(des.index, 0, movedItem);
    return lists;
  };

  getItems = async () => {
    const results = await customFetch('/tasks');
    this.setState({
      lists: normalizeList(results),
    });
  };

  async componentDidMount() {
    await this.getItems();
  }

  getList = (id) => this.state[this.id2List[id]];

  onDragEnd = async (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const reorder = (listId, startIndex, endIndex) => {
        const { lists } = this.state;
        const listsCopy = cloneDeep(lists);
        const [removed] = listsCopy[listId].splice(startIndex, 1);
        listsCopy[listId].splice(endIndex, 0, removed);
        return listsCopy;
      };

      const items = reorder(
        source.droppableId,
        source.index,
        destination.index
      );

      this.setState(
        (pre) => ({
          ...pre,
          lists: items,
        }),
        async () => {
          const payload = getTaskMovePayload(items);
          await callMoveApi(payload);
          this.getItems();
        }
      );
    } else {
      const result = this.move(source, destination);
      this.setState(
        {
          lists: result,
        },
        () => {
          moveApi();
        }
      );

      const moveApi = async () => {
        const { lists } = this.state;
        const payload = getTaskMovePayload(lists);
        await callMoveApi(payload);
        this.getItems();
      };
    }
  };

  addTask = async (listKey, payload) => {
    const {title} = payload;
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
    this.getItems();
  };

  render() {
    const { lists } = this.state;
    console.log({lists});
    return (
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          {Object.keys(lists)?.map((key) => {
            const listItem = lists[key];
            return (
              <List listItem={listItem} listKey={key} addTask={this.addTask} />
            );
          })}
        </DragDropContext>
      </div>
    );
  }
}

// Put the things into the DOM!

export default Board;
