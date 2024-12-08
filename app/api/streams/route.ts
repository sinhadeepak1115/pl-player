import { prismaClient } from "@/lib/db";
import e from "express";
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
    const body = await req.json();

    if (!body || typeof body !== "object") {
      throw new Error("Request body is null or not an object");
    }
    const data = CreateStreamSchema.parse(body);
    console.log(data);
    const isYt = data.url.match(YT_REGEX);
    if (!isYt) {
      return NextResponse.json(
        {
          message: "Invalid URL",
        },
        { status: 400 },
      );
    }

    const extractedUrl = body.url.split("?v=")[1];

    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedUrl,
        type: "YouTube",
      },
    });
    console.log(stream);
    return NextResponse.json(
      { message: "created the stream" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation Error",
          errors: error.errors,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error", errors: error },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  const streams = await prismaClient.stream.findMany({
    where: {
      userId: creatorId ?? "",
    },
  });

  return NextResponse.json({
    streams,
  });
}
