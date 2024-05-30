const { customFetch } = require("@/utils/helper");

export async function updateTaskById(taskId, data) {
    return customFetch(`/tasks/${taskId}`, 'PATCH', data);
}

export async function getCardDetail(taskId) {
    return customFetch(`/tasks/${taskId}`)
}


export async function postCommentOnTask(taskId, commentData) {
    return customFetch(`/tasks/${taskId}/comment`, 'POST', commentData)
}