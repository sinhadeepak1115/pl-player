import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prismaClient } from "@/lib/db";

const UpvoteSchema = z.object({ streamId: z.string() });

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  //TODO: get rid of db call here
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  try {
    const data = UpvoteSchema.parse(await req.json());
    await prismaClient.upvote.create({
      data: {
        userId: user.id,
        streamId: data.streamId,
      },
    });
  } catch (error) {
    return NextResponse.error();
  }

  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
