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
        const customer = await prisma.customer.findUnique({ where: { id: Number(id) } })
        if (customer) {
          res.status(200).json(customer)
        } else {
          res.status(404).json({ message: 'Customer not found' })
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
         const { customername,customeremail } = body
       
        if (!customername || !customeremail ) {
           res.status(400).json({ message: 'Missing required fields' })
         } else {
          const updatedCustomer = await prisma.customer.update({
            where: { id: Number(id) },
            data: {
             customername,
             customeremail
            }
          })
          res.status(200).json(updatedCustomer)
  
       }
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
      break
      case 'DELETE':
  try {
    const customer = await prisma.customer.delete({ where: { id: Number(id) } })
    if (customer) {
      res.status(204).send('')
    } else {
      res.status(404).json({ message: `Customer with ID ${id} not found` })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }finally {
    await prisma.$disconnect() 
  }
  break;
      }}
     