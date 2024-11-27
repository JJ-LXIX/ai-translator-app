"use client";
import { TranslationLanguages } from "@/app/translate/page";
import React from "react";
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

type Props = {
  languages: TranslationLanguages;
};

function TranslationForm({ languages }: Props) {
  return (
    <div>
      <form>
        {/* Left Side Input */}
        <div>
          <Select name="inputLanguage" defaultValue="auto">
            <SelectTrigger className="w-[280px]">
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
          />
        </div>

        {/* Right Side Input */}
        <div>
          <Select name="inputLanguage" defaultValue="es">
            <SelectTrigger className="w-[280px]">
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
          />
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default TranslationForm;
