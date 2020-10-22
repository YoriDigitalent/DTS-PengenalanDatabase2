// register root file untuk menggunakan sourcemap
import 'source-map-support/register'

import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import mongodb from 'mongodb'
//import mongoose from 'mongoose'
import { Account, AccountType } from './mongodb'


async function initApp() {
  const app = express()

  //init Db
  const connection = await mongodb.connect('${process.env.MONGODB_URI}')
  const db = connection.db('${process.env.MONGODB_NAME}')
  
  mongodb.connect(`${process.env.MONGODB_URI}`, {useNewUrlParser: true, useUnifiedTopology:true})
  const accountModel = new Account (db)

  app.use(bodyParser.json())

  app.post('/account', async function(req, res, next) {
    try {
      await accountModel.create(req.body)
    } catch (error) {
      return next(error)
    }

    res.send({success: true})

  })

  app.get('/account', async function(req, res, next) {
    let accounts: AccountType[]
    try {
      accounts = await accountModel.getAll()
    } catch (error) {
      return next(error)
    }

    return res.send(accounts)

  })

  app.get('/account/:id', async function(req, res, next) {
    let account: Account | null
    try {
      account = await accountModel.getByID(req.params.id)
    } catch (error) {
      return next(error)
    }

    return res.send(account)

  })

  app.put('/account/:id', async function(req, res, next) {
    try {
      await accountModel.update(req.params.id, req.body)
    } catch (error) {
      return next(error)
      
    }

    res.send({ success: true})

  })

  app.delete('/account',async function(req, res, next) {
    try {
      await accountModel.delete(req.params.id)
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