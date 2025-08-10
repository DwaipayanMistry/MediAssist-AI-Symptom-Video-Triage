import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() {
  try {
    // Run a simple query: count users (empty table initially)
    const count = await prisma.user.count()
    console.log(`User count in DB: ${count}`)
  } catch (error) {
    console.error('Error connecting to DB:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
