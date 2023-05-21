//import { applyCors } from '../../../middlewares/cors';
import { NextApiRequest, NextApiResponse } from "next";
//import { prisma } from '../../../utils/prisma'
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["query"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const author = await prisma.author.findMany();
        res.status(200).json(author);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
      break;
    case "POST":
      try {
        const body = JSON.parse(req.body);
        const { authorname } = body;
        console.log("author:", authorname);
        console.log("request is", req.body);
        if (!authorname) {
          res.status(400).json({ message: "Missing required fields" });
        } else {
          const newAuthor = await prisma.author.create({
            data: {
              authorname,
            },
          });
          res.status(201).json(newAuthor);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
      break;
  }
}
