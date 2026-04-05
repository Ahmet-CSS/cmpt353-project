import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    const channels = await prisma.channel.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    return NextResponse.json(channels);
}

export async function POST(request: Request) {
    const body = await request.json();
    const channel = await prisma.channel.create({
        data: {
            name: body.name,
            description: body.description || '',
            createdById: 1,
        },
    });
    return NextResponse.json(channel);
}   