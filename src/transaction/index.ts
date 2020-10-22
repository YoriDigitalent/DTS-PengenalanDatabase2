// register root file untuk menggunakan sourcemap
import 'source-map-support/register'

import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import mongodb from 'mongodb'
//import mongoose from 'mongoose'
import { Transaction, TransactionType } from './mongodb'


async function initApp() {
  const app = express()

  //init Db
  const connection = await mongodb.connect('${process.env.MONGODB_URI}')
  const db = connection.db('${process.env.MONGODB_NAME}')
  
  mongodb.connect(`${process.env.MONGODB_URI}`, {useNewUrlParser: true, useUnifiedTopology:true})
  const transactionModel = new Transaction (db)

  app.use(bodyParser.json())

  app.post('/transaction', async function(req, res, next) {
    try {
      await transactionModel.create(req.body)
    } catch (error) {
      return next(error)
    }

    res.send({success: true})

  })

  app.get('/transaction', async function(req, res, next) {
    let transactions: TransactionType[]
    try {
      transactions = await transactionModel.getAll()
    } catch (error) {
      return next(error)
    }

    return res.send(transactions)

  })

  app.get('/transaction/:id', async function(req, res, next) {
    let transaction: Transaction | null
    try {
      transaction = await transactionModel.getByID(req.params.id)
    } catch (error) {
      return next(error)
    }

    return res.send(transaction)

  })

  app.put('/transaction/:id', async function(req, res, next) {
    try {
      await transactionModel.update(req.params.id, req.body)
    } catch (error) {
      return next(error)
      
    }

    res.send({ success: true})

  })

  app.delete('/transaction',async function(req, res, next) {
    try {
      await transactionModel.delete(req.params.id)
    } catch (error) {
      return next(error)
      
    }

    res.send({ success: true})

  })

  app.use(function(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(500).send({
      success: false,
      message: err.message
    })
  })

  app.listen(process.env.PORT || 8000, () => {
    console.log(`App listen on port ${ process.env.PORT || 8000 }`)
  })
}

initApp()