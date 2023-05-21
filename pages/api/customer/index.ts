//import { applyCors } from '../../../middlewares/cors';
import { NextApiRequest, NextApiResponse } from 'next'
//import { prisma } from '../../../utils/prisma'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query'],
})


 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'GET':
      try {
        const customer = await prisma.customer.findMany()
        res.status(200).json(customer)
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
        const { customername,customeremail } = body
      
        if (!customername || !customeremail ) {
            res.status(400).json({ message: 'Missing required fields' })
          } else {
          const newCustomer = await prisma.customer.create({
            data: {
           customername,
           customeremail
              
            }
          })
          res.status(201).json(newCustomer)
        
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
