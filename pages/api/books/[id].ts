//import { applyCors } from '../../../middlewares/cors';
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query'],
})


 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: { id } } = req

  switch (method) {
    case 'GET':
      try {
        const book = await prisma.books.findUnique({ where: { id: Number(id) } })
        if (book) {
          res.status(200).json(book)
        } else {
          res.status(404).json({ message: 'Book not found' })
        }
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }finally {
        await prisma.$disconnect() 
      }
      break
    case 'PUT':
      try {
        const body=JSON.parse(req.body)
         const { bookname, author, booktype, price, qty, isbn } = body
       
        if (!bookname || !author || !booktype || !price || !qty || !isbn) {
           res.status(400).json({ message: 'Missing required fields' })
         } else {
          const updatedBook = await prisma.books.update({
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
    const book = await prisma.books.delete({ where: { id: Number(id) } })
    if (book) {
      res.status(204).send('')
    } else {
      res.status(404).json({ message: `Book with ID ${id} not found` })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }finally {
    await prisma.$disconnect() // Disconnect the prisma client after each request
  }
  break;
      }}
     