import { getCardDetail } from "@/actions/tasks.actions";
import CardDetail from "@/components/taskDetailCard";
import { normalizeTask } from "@/model/tasks.model";
import React from "react";
const dynamic = "force-dynamic";
export const revalidate = 0;

async function CardDetailPage({ params: { taskId } }) {
  const res = await getCardDetail(taskId);
  console.log({res});
  const normalisedData = normalizeTask(res);
  return (
    <>
      <CardDetail data={normalisedData} />
    </>
  );
}

export default CardDetailPage;
