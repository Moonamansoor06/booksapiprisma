//import { applyCors } from '../../../middlewares/cors';
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query'],
})


 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
console.log("books is",prisma.books)
  switch (method) {
    case 'GET':
      try {
        const books = await prisma.books.findMany()
        res.status(200).json(books)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }finally {
        await prisma.$disconnect() 
      }
      break
    case 'POST':
      try {
        const body=JSON.parse(req.body)
        const { bookname, author, booktype, price, qty, isbn } = body
        console.log('bookname',bookname,'author:',author)
        console.log("request is",req.body)
        if (!bookname || !author || !booktype || !price || !qty || !isbn) {
            res.status(400).json({ message: 'Missing required fields' })
          } else {
          const newBook = await prisma.books.create({
            data: {
              bookname,
              booktype,
              author,
              qty,
              isbn,
              price,
              
            }
          })
          res.status(201).json(newBook)
    
         }
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }finally {
        await prisma.$disconnect() 
      }
      break
    
  }
}
