import { prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const YT_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;
const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const isYt = YT_REGEX.test(data.url);
    if (!isYt) {
      return NextResponse.json(
        {
          message: "Invalid URL",
        },
        { status: 400 },
      );
    }
    const extractedId = data.url.split("?v=")[1];
    prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "YouTube",
      },
    });
    console.log(data);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Invalid data",
      },
      { status: 400 },
    );
  }
}
