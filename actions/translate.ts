"use server";

import { State } from "@/app/Components/TranslationForm/TranslationForm";
import { addOrUpdateUser, ITranslation } from "@/mongodb/models/User";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { v4 } from "uuid";

const endpoint = process.env.AZURE_TEXT_TRANSLATION;
const key = process.env.AZURE_TEXT_TRANSLATION_KEY;
const location = process.env.AZURE_TEXT_LOCATION;

async function translate(prevState: State, formData: FormData) {
  await auth.protect();
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const rawFormData = {
    input: formData.get("input") as string,

    inputLanguage: formData.get("inputLanguage") as string,
    output: formData.get("output") as string,
    outputLanguage: formData.get("outputLanguage") as string,
  };

  const response = await axios({
    baseURL: endpoint,
    url: "translate",
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key!,
      "Ocp-Apim-Subscription-Region": location!,
      "Content-Type": "application/json",
      "X-ClientTraceId": v4().toString(),
    },
    params: {
      "api-version": "3.0",
      from:
        rawFormData.inputLanguage === "auto" ? null : rawFormData.inputLanguage,
      to: rawFormData.outputLanguage,
    },
    data: [
      {
        text: rawFormData.input,
      },
    ],
    responseType: "json",
  });

  const data = await response.data;

  if (data.error) {
    console.log(`Error ${data.error.code} : ${data.error.message}`);
  }

  //   TODO: Push to MongoDB
  if (rawFormData.inputLanguage === "auto") {
    rawFormData.inputLanguage = data[0].detectedLanguage.language;
  }

  try {
    const translation = {
      to: rawFormData.outputLanguage,
      from: rawFormData.inputLanguage,
      fromText: rawFormData.input,
      toText: data[0].translations[0].text,
    };
    addOrUpdateUser(userId, translation);
  } catch (error) {
    console.log("Error adding translation to user: ", error);
  }

  return {
    ...prevState,
    output: data[0].translations[0].text,
  };
}

export default translate;
