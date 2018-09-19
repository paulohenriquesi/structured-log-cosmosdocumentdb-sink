const { LogEventLevel } = require(structured-log)
const { Client, Collection } = require('documentdb-typescript')

class CosmosDocumentDbSinkOptions {
    constructor(
    url,
    authorizationKey,
    databaseName,
    collectionName,
    restrictedToMinimumLevel = LogEventLevel.information){

        if(!url)
            throw new Error(`'url' parameter is required`)
        if(!authorizationKey)
            throw new Error(`'authorizationKey' parameter is required`)
        if(!databaseName)
            throw new Error(`'databaseName' parameter is required`)
        if(!collectionName)
            throw new Error(`'collectionName' parameter is required`)        
        
        this.url = url
        this.authorizationKey = authorizationKey
        this.databaseName = databaseName
        this.collectionName = collectionName
        this.restrictedToMinimumLevel = restrictedToMinimumLevel
    }
}

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
            this.collection.storeDocumentAsync(event)
        });
    }
}

module.exports = { CosmosDocumentDbSinkOptions, CosmosDocumentDbSink }