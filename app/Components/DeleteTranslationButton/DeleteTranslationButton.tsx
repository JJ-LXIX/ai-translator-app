"use client";
import deleteTranslation from "@/actions/deleteTranslation";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import React, { Key } from "react";

type Props = {
  id: string;
};

export default function DeleteTranslationButton({ id }: Props) {
  const deleteTranslationAction = deleteTranslation.bind(null, id);
  return (
    <form action={deleteTranslationAction}>
      <Button
        type="submit"
        variant="outline"
        size="icon"
        className="border-red-500 text-red-500 hover:bg-red-400 hover:text-white"
      >
        <TrashIcon size={16} />
      </Button>
    </form>
  );
}
