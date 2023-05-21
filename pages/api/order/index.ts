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
        const order = await prisma.orderdetails.findMany();
        res.status(200).json(order);
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
        const { bookid, customerid, qty } = body;

        if (!bookid || !customerid || !qty) {
          res.status(400).json({ message: "Missing required fields" });
        } else {
          const newOrder = await prisma.orderdetails.create({
            data: {
              bookid,
              customerid,
              qty,
            },
          });
          res.status(201).json(newOrder);
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
