import { auth } from "@clerk/nextjs/server";
import React from "react";
import TranslationForm from "../Components/Header/TranslationForm/TranslationForm";

export type TranslationLanguages = {
  translation: {
    [key: string]: {
      name: string;
      nativeName: string;
      dir: "ltr" | "rtl";
    };
  };
};

export default async function TranslatePage({}) {
  await auth.protect();

  const { userId } = await auth();
  if (!userId) throw new Error("User not logged in");

  const languagesEndpoint =
    "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0";
  const response = await fetch(languagesEndpoint, {
    next: {
      revalidate: 3600 * 24,
    },
  });

  const languages = (await response.json()) as TranslationLanguages;

  return (
    <div>
      {/* Translation Form */}
      <TranslationForm languages={languages} />

      {/* Translation History */}
    </div>
  );
}
