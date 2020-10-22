import mongodb from 'mongodb'

export type TransactionType = {
  account_id: string
  amount: number
  date: string
  description: string

}

export class Transaction {
  private collection: mongodb.Collection<TransactionType>

  constructor(db: mongodb.Db) {
    this.collection = db.collection('transaction')
  }

  async create(data: TransactionType) {
    try {
      const result = await this.collection.insertOne(data)
      console.log('Insert result %j', result)
    } catch (error) {
      throw error
    }

  }

  async getAll(): Promise<TransactionType[]> {
    let transactions: TransactionType[]
    try {
      transactions = await this.collection.find({}).toArray()
    } catch (error) {
      throw error
    }

    return transactions

  }

  async getByID(transactionID: string) {
    let transaction: Transaction | null
    try {
      transaction = await this.collection.findOne({_id: new mongodb.ObjectID(transactionID)})
    } catch (error) {
      throw error
      
    }
    
    return transaction
  }

  async update(transactionID: string, data: Partial<TransactionType>) {
    try {
      await this.collection.updateOne({_id: new mongodb.ObjectID(transactionID)}, {$set: data})
    } catch (error) {
      throw error
      
    }

  }


  async delete(transactionID: string) {
    try {
      await this.collection.deleteOne({_id: new mongodb.ObjectID(transactionID)})
    } catch (error) {
      throw error
    }

  }
}