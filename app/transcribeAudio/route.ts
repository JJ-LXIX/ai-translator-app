import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("audio") as File;
  console.log(">>", file);

  if (
    process.env.AZURE_API_KEY === undefined ||
    process.env.AZURE_ENDPOINT === undefined ||
    process.env.AZURE_DEPLOYMENT_NAME === undefined
  ) {
    console.log("azure credentials not set");
    return {
      sender: "",
      response: "Azure credentials not set",
    };
  }

  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }

  try {
    // Convert the File object to a File with required properties
    const audioFile = new File([file], "audio.webm", {
      type: "audio/webm",
      lastModified: Date.now(),
    });

    const client = new OpenAI({
      apiKey: process.env.AZURE_API_KEY,
      baseURL: `${process.env.AZURE_ENDPOINT}/openai/deployments/${process.env.AZURE_DEPLOYMENT_NAME}`,
      defaultQuery: { "api-version": "2024-02-15-preview" },
      defaultHeaders: { "api-key": process.env.AZURE_API_KEY },
    });

    const result = await client.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
