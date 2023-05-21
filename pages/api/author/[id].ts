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
  const {
    method,
    query: { id },
  } = req;

  switch (method) {
    case "GET":
      try {
        const author = await prisma.author.findUnique({
          where: { id: Number(id) },
        });
        if (author) {
          res.status(200).json(author);
        } else {
          res.status(404).json({ message: "Author not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
      break;
    case "PUT":
      try {
        const body = JSON.parse(req.body);
        const { authorname } = body;

        if (!authorname) {
          res.status(400).json({ message: "Missing required fields" });
        } else {
          const updatedAuthor = await prisma.author.update({
            where: { id: Number(id) },

            data: {
              authorname,
            },
          });
          res.status(200).json(updatedAuthor);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    case "DELETE":
      try {
        const author = await prisma.author.delete({
          where: { id: Number(id) },
        });
        if (author) {
          res.status(204).send("");
        } else {
          res.status(404).json({ message: `Author with ID ${id} not found` });
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
