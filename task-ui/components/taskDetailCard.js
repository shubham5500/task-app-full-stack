"use client";
import { isEmpty } from "lodash";
import { customFetch, getRandomClass } from "@/utils/helper";
import { AttachmentIcon, LinkIcon } from "@/utils/icons";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  getCardDetail,
  postCommentOnTask,
  updateTaskById,
} from "@/actions/tasks.actions";
import { normalizeComment, normalizeTask } from "@/model/tasks.model";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Input from "./UI/Input";
import Modal from "./UI/Modal";
import useUserDetail from "@/hooks/useUserDetail";
import useUsers from "@/hooks/useUsers";
import Button from "./UI/Button";

const CardDetail = ({ data }) => {
  const fileInputRef = useRef(null);
  const [newComment, setNewComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState(null);
  const [assignedUser, setAssignedUser] = useState(taskData);
  useEffect(() => {
    setAssignedUser(taskData?.assignedTo)
  }, [taskData?.assignedTo])

  const { getUserDetail, user } = useUserDetail();

  const params = useParams();
  const [boardId, taskId] = params["task-detail"];
  const { users = [] } = useUsers(boardId);

  const getCardDetailApi = async () => {
    try {
      setLoading(true);
      const res = await getCardDetail(taskId);
      const normalisedData = normalizeTask(res);
      await getUserDetail(normalisedData.createdBy);
      setTaskData(normalisedData);
    } catch (error) {
      toast(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCardDetailApi();
  }, []);

  const handleAddComment = async () => {
    try {
      if (newComment.trim()) {
        setLoading(true);
        const { result } = await postCommentOnTask(taskData.id, {
          text: newComment,
        });
        setTaskData({
          ...taskData,
          comments: [...taskData.comments, normalizeComment(result)],
        });
        setNewComment("");
      }
    } catch (error) {
      toast(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onFileAttach = () => {
    fileInputRef.current.click();
  };

  const assign = async () => {
    try {
      const result = await customFetch(`/tasks/${taskData?.id}/assign`, "POST", {
        assignToId: assignedUser,
      });
      toast("Assigned Successfully!");
    } catch (error) {
      toast(error.message)
    }
  };

  const backgroundColor = getRandomClass("bg");

  async function onSaveDescription() {
    try {
      setLoading(true);
      await updateTaskById(taskData.id, {
        ...taskData,
      });

      const taskDetailRes = await getCardDetail(taskData.id);
      const normalisedData = normalizeTask(taskDetailRes);

      setTaskData({
        ...taskData,
        ...normalisedData,
      });
    } catch (error) {
      toast(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal>
      {loading && <div>Loading...</div>}
      {!loading && (
        <>
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-xl font-bold">{taskData?.title}</h2>
              <p className="text-gray-400">in list {taskData?.list?.title}</p>
              {user && (
                <p className="text-gray-400 text-xs">Created by: {user.name}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="text-sm">Assigned To</label>
              <div className="flex">
                <select
                  className="bg-gray-700 p-2 w-full rounded-md"
                  onChange={(e) => {
                    setAssignedUser(e.target.value);
                  }}
                  value={assignedUser}
                >
                  {users.length > 0 && users.map((item) => (
                    <option key={item?.id} value={item.user_id}>{item.name}</option>
                  ))}
                </select>
                <Button
                  className="px-3 bg-blue-600 rounded-md ml-1"
                  onClickHandler={assign}
                >
                  Assign
                </Button>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-3">Description</h3>
              <textarea
                className="bg-gray-700 p-2 w-full rounded-md"
                placeholder="Add a more detailed description..."
                rows="3"
                onChange={(e) =>
                  setTaskData({
                    ...taskData,
                    description: e.target.value,
                  })
                }
                value={taskData?.description}
              ></textarea>
              <button
                className={`disabled:bg-gray-600 enabled:bg-blue-600 px-4 py-2 rounded-md`}
                onClick={onSaveDescription}
                disabled={!taskData?.description}
              >
                Save
              </button>
            </div>

            {taskData?.file && taskData?.file?.url && (
              <div className="mb-4">
                <h3 className="font-semibold mb-3">Attachments</h3>
                <div className="flex items-center">
                  <div className="w-4">{LinkIcon}</div>
                  <Link
                    className="pl-2 underline text-sm"
                    href={taskData?.fileUrl}
                    target="_blank"
                  >
                    Link
                  </Link>
                </div>
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-semibold">Activity</h3>
              <div>
                {taskData?.comments?.map((comment, index) => (
                  <div key={index} className="flex mt-2">
                    <div>
                      <div
                        className={`flex justify-center text-white items-center bg-red-500 rounded-[50%] w-8 h-8`}
                      >
                        {comment.user.name.charAt(0)}
                      </div>
                    </div>
                    <div className="pl-3">
                      <p>
                        <span className="font-bold text-slate-300">
                          {comment.user.name}{" "}
                        </span>
                        <span className="text-gray-400 text-xsm">
                          {new Date(comment.createdAt).toUTCString()}
                        </span>
                      </p>
                      <p className=" rounded-md mt-1">{comment.text}</p>
                      <div className="text-gray-500 text-sm mt-1 space-x-2">
                        <button className="hover:underline">Edit</button>
                        <button className="hover:underline">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Input
                  type="text"
                  className="bg-gray-700 p-2 w-full rounded-md"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className="bg-blue-600 px-4 py-2 rounded-md mt-2"
                  onClick={handleAddComment}
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <div
                className="relative cursor-pointer flex bg-gray-600 px-3 py-2 rounded-md w-full justify-between"
                onClick={onFileAttach}
              >
                <span className="pr-1">{AttachmentIcon}</span> Attach
                <input
                  type="file"
                  ref={fileInputRef}
                  className="invisible absolute top-0 left-0 w-full h-full"
                />
              </div>

              {/* <button className="bg-gray-600 px-4 py-2 rounded-md w-full">
            Copy
          </button>
          <button className="bg-gray-600 px-4 py-2 rounded-md w-full">
            Make template
          </button>
          <button className="bg-gray-600 px-4 py-2 rounded-md w-full">
            Archive
          </button> */}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default CardDetail;
