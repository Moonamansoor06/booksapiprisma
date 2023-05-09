import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: { id } } = req

  switch (method) {
    case 'GET':
      try {
        const book = await prisma.book.findUnique({ where: { id: Number(id) } })
        if (book) {
          res.status(200).json(book)
        } else {
          res.status(404).json({ message: 'Book not found' })
        }
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
      break
    case 'PUT':
      try {
        const { bookname, author, booktype, price, qty, isbn } = req.body
        if (!bookname || !author || !booktype || !price || !qty || !isbn) {
          res.status(400).json({ message: 'Missing required fields' })
        } else {
          const updatedBook = await prisma.book.update({
            where: { id: Number(id) },
            data: {
              bookname,
              author,
              booktype,
              price,
              qty,
              isbn
            }
          })
          res.status(200).json(updatedBook)
        }
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
      break
      case 'DELETE':
  try {
    const book = await prisma.book.delete({ where: { id: Number(id) } })
    if (book) {
      res.status(204).send('')
    } else {
      res.status(404).json({ message: `Book with ID ${id} not found` })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
  break;
      }}