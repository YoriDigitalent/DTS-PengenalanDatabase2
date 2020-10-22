import mongodb from 'mongodb'

export type AccountType = {
  customer_id: string
  account_number: string
  balance: number
  acount_type: string

}

export class Account {
  private collection: mongodb.Collection<AccountType>

  constructor(db: mongodb.Db) {
    this.collection = db.collection('account')
  }

  async create(data: AccountType) {
    try {
      const result = await this.collection.insertOne(data)
      console.log('Insert result %j', result)
    } catch (error) {
      throw error
    }

  }

  async getAll(): Promise<AccountType[]> {
    let accounts: AccountType[]
    try {
      accounts = await this.collection.find({}).toArray()
    } catch (error) {
      throw error
    }

    return accounts

  }

  async getByID(accountID: string) {
    let account: Account | null
    try {
      account = await this.collection.findOne({_id: new mongodb.ObjectID(accountID)})
    } catch (error) {
      throw error
      
    }
    
    return account
  }

  async update(accountID: string, data: Partial<AccountType>) {
    try {
      await this.collection.updateOne({_id: new mongodb.ObjectID(accountID)}, {$set: data})
    } catch (error) {
      throw error
      
    }

  }


  async delete(accountID: string) {
    try {
      await this.collection.deleteOne({_id: new mongodb.ObjectID(accountID)})
    } catch (error) {
      throw error
    }

  }
}