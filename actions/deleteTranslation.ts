"use server";

import { removeTranslation } from "@/mongodb/models/User";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

async function deleteTranslation(id: string): Promise<any> {
  await auth.protect();
  const { userId } = await auth();
  const user = await removeTranslation(userId!, id);
  revalidateTag("translationHistory");
  return {
    translations: JSON.stringify(user.translations),
  };
}
export default deleteTranslation;
