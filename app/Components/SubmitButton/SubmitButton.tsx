"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
type Props = {
  disabled: boolean;
};

export default function SubmitButton({ disabled }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      className="bg-blue-500 hover:bg-blue-600 w-full lg:w-fit"
    >
      {pending ? "Translating..." : "Translate"}
    </Button>
  );
}
