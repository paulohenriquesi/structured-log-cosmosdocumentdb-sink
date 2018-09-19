const { LogEventLevel } = require(structured-log)

class CosmosDocumentDbSinkOptions {
    constructor(url, authorizationKey, databaseName, collectionName, restrictedToMinimumLevel = LogEventLevel.information){
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

module.exports = CosmosDocumentDbSinkOptions