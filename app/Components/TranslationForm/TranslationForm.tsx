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
import { LetterText, Volume2Icon } from "lucide-react";
import SubmitButton from "../SubmitButton/SubmitButton";
import { Button } from "@/components/ui/button";
import Recorder, { mimeType } from "../Recorder/Recorder";

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
    if (!input.trim()) return;

    const delayDebounceFn = setTimeout(() => {
      submitBtnRef.current?.click();
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [input]);

  useEffect(() => {
    if (state.output) {
      setOutput(state.output);
    }
  }, [state]);

  const playAudio = async () => {
    const synth = window.speechSynthesis;
    console.log(synth);
    if (!output || !synth) return;
    const wordsToSay = new SpeechSynthesisUtterance(output);
    synth.speak(wordsToSay);
  };

  const uploadAudio = async (blob: Blob) => {
    const file = new File([blob], mimeType, { type: mimeType });

    const formData = new FormData();
    formData.append("audio", file);

    const response = await fetch("/transcribeAudio", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.text) {
      setInput(data.text);
    }
  };

  return (
    <div>
      <form action={formAction}>
        <div className="flex space-x-2">
          <div className="flex items-center group cursor-pointer border rounded-md w-fit px-3 py-2 bg-[#e7f0fe] mb-5">
            <LetterText />
            <p className="text-sm font-medium text-blue-500 group-hover:underline ml-2 ">
              Text
            </p>
          </div>

          <Recorder uploadAudio={uploadAudio} />
        </div>

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
            <div className="flex items-center justify-between">
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
                    {Object.entries(languages.translation).map(
                      ([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                type="button"
                onClick={playAudio}
                className=""
                disabled={!output}
              >
                <Volume2Icon
                  size={30}
                  className="text-blue-500 cursor-pointer disabled:cursor-not-allowed"
                />
              </Button>
            </div>
            <Textarea
              placeholder="Type your message here"
              className="min-h-32 text-xl"
              name="output"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <SubmitButton disabled={!input} />
          <button type="submit" ref={submitBtnRef} hidden />
        </div>
      </form>
    </div>
  );
}

export default TranslationForm;
