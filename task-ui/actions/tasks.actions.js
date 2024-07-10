
import {customFetch, server_url} from '../utils/helper'

export async function updateTaskById(taskId, data) {
    return customFetch(`/tasks/${taskId}`, 'PATCH', data,);
}

export async function getCardDetail(taskId) {
    return customFetch(`/tasks/${taskId}`)
}


export async function postCommentOnTask(taskId, commentData) {
    return customFetch(`/tasks/${taskId}/comment`, 'POST', commentData)
}

export async function getTask() {
    const token = cookies().get('token').value;
    return fetch(`${server_url}/tasks`, {
      method: "GET",
      headers: {
        "auth-token": token,
      },
    })
      .then((res) => res.json())
      .then((res) => res);
  }