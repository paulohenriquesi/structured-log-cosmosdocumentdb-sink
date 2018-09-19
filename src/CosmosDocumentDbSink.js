'use strict'

const uuid = require('uuid')
const { Client, Collection } = require('documentdb-typescript')

class CosmosDocumentDbSink {
    constructor(options){
        if(!options)
            throw new Error(`'options' parameter is required`)
        
        this.options = options

        this.client = new Client(this.options.url, this.options.authorizationKey)
        this.collection = new Collection(this.options.collectionName, this.options.databaseName, this.client)
    }   

    async emit(events) {
        if(this.client.isOpen === false)
            await this.client.openAsync()

        await this.collection.openAsync()

        events.forEach(event => {
            this.collection.storeDocumentAsync({id: uuid.v4(), event})
        });
    }
}

module.exports = CosmosDocumentDbSink