import { get } from "lodash";

export const normalizeTask = (data) => {
  return {
    id: get(data, "id", ""),
    title: get(data, "title", ""),
    assignedTo: get(data, 'assigned_to', ''),
    createdBy: get(data, 'created_by', ''),
    description: get(data, 'description', ''),
    dueDate: get(data, 'due_date', ''),
    fileUrl: get(data, 'file.url', ''),
    list: get(data, 'list', ''),
    priority: get(data, 'priority', ''),
    position: get(data, 'position', ''),
    comments: get(data, 'comments', []).map(item => normalizeComment(item)),
    status: get(data, 'status', ''),
  };
};

export const normalizeComment = (data) => {
  return {
    id: get(data, 'id', ''),
    createdAt: get(data, 'created_at', ''),
    user: normalizeUser(get(data, 'user', '')),
    text: get(data, 'text', ''),
  }
}

export const normalizeUser = (data) => {
  return {
    id: get(data, 'id', ''),
    name: get(data, 'name', ''),
  }
}