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
        const order = await prisma.orderdetails.findUnique({
          where: { id: Number(id) },
        });
        if (order) {
          res.status(200).json(order);
        } else {
          res.status(404).json({ message: "Order not found" });
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
        const { bookid, customerid, qty } = body;

        if (!bookid || !customerid || !qty) {
          res.status(400).json({ message: "Missing required fields" });
        } else {
          const updatedOrder = await prisma.orderdetails.update({
            where: { id: Number(id) },
            data: {
              bookid,
              customerid,
              qty,
            },
          });
          res.status(200).json(updatedOrder);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    case "DELETE":
      try {
        const order = await prisma.orderdetails.delete({
          where: { id: Number(id) },
        });
        if (order) {
          res.status(204).send("");
        } else {
          res.status(404).json({ message: `Order with ID ${id} not found` });
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
