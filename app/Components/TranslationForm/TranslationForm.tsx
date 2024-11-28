"use client";
import { TranslationLanguages } from "@/app/translate/page";
import React, { useActionState, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import translate from "@/actions/translate";
import { LetterText } from "lucide-react";

type Props = {
  languages: TranslationLanguages;
};

const initialState = {
  inputLanguage: "auto",
  input: "",
  outputLanguage: "hi",
  output: "",
};
export type State = typeof initialState;

function TranslationForm({ languages }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [state, formAction] = useActionState(translate, initialState);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (state.output) {
      setOutput(state.output);
    }
  }, [state]);

  useEffect(() => {
    if (!input.trim()) return;

    const delayDebounceFn = setTimeout(() => {
      submitBtnRef.current?.click();
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [input]);

  return (
    <div>
      <div className="flex space-x-2">
        <div className="flex items-center group cursor-pointer border rounded-md w-fit px-3 py-2 bg-[#e7f0fe] mb-5">
          <LetterText />
          <p className="text-sm font-medium text-blue-500 group-hover:underline ml-2 ">
            Text
          </p>
        </div>
      </div>

      <form action={formAction}>
        <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
          {/* Left Side Input */}
          <div className="flex-1 space-y-2">
            <Select name="inputLanguage" defaultValue="auto">
              <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Let us figure it out!</SelectLabel>
                  <SelectItem key="auto" value="auto">
                    Auto-Detect
                  </SelectItem>
                </SelectGroup>

                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {Object.entries(languages.translation).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Type your message here"
              className="min-h-32 text-xl"
              name="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Right Side Input */}
          <div className="flex-1 space-y-2">
            <Select name="outputLanguage" defaultValue="hi">
              <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Let us figure it out!</SelectLabel>
                  <SelectItem key="auto" value="auto">
                    Auto-Detect
                  </SelectItem>
                </SelectGroup>

                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {Object.entries(languages.translation).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Type your message here"
              className="min-h-32 text-xl"
              name="output"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button type="submit" ref={submitBtnRef}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default TranslationForm;
