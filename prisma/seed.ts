import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create a user
  const user = await prisma.user.upsert({
    where: { email: 'omen@example.com' },
    update: {},
    create: {
      displayName: 'Omen',
      email: 'omen@example.com',
      passwordHash: 'teleportation123',
      role: 'admin',

    }
  })
  const channel1 = await prisma.channel.upsert({
    where: { name: 'javascript' },
    update: {},
    create: {
        name: 'javascript',
        description: 'A channel for JavaScript enthusiasts',
        createdById: user.id,
    }
    })
    const channel2 = await prisma.channel.upsert({  
    where: { name: 'python' },
    update: {},
    create: {
        name: 'python',
        description: 'A channel for Python enthusiasts',
        createdById: user.id,
    }
    })

    const post1 = await prisma.post.create({
        data: {
            title: 'How to learn JavaScript?',
            body: 'I am new to programming and want to learn JavaScript. Any tips?',
            authorId: user.id,
            channelId: channel1.id,
        },
    })
    await prisma.post.create({
        data: {
            title: 'Best Python libraries for data science?',
            body: 'What are the best Python libraries for data science in 2026?',
            authorId: user.id,
            channelId: channel2.id,
        },
    })
    await prisma.reply.create({
        data: {
            body: 'I recommend starting with the basics of JavaScript and then moving on to frameworks like React or Node.js.',
            authorId: user.id,
            postId: post1.id,
        },
    })

    main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
}

