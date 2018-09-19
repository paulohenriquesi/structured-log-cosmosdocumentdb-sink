import { LogEventLevel, LogEvent } from 'structured-log/src/logEvent'
import { Sink } from 'structured-log/src/sink'
import { Client, Database, Collection } from 'documentdb-typescript'


export class CosmosDocumentDbSinkOptions {
    url: string
    authorizationKey: string
    databaseName: string
    collectionName: string
    restrictedToMinimumLevel: LogEventLevel

    constructor(url, authorizationKey, databaseName, collectionName, restrictedToMinimumLevel = LogEventLevel.debug){
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

export class CosmosDocumentDbSink implements Sink {
    private options : CosmosDocumentDbSinkOptions
    private collection : Collection
    private client: Client;

    constructor(options){
        if(!options)
            throw new Error(`'options' parameter is required`)
        
        this.options = options

        this.client = new Client(this.options.url, this.options.authorizationKey)
        this.collection = new Collection(this.options.collectionName, this.options.databaseName, this.client)
    }

    async emit(events: LogEvent[]) {
        if(this.client.isOpen === false)
            await this.client.openAsync()

        await this.collection.openAsync()

        events.forEach(event => {
            this.collection.storeDocumentAsync(event)
        });

    }    
    
    flush(): Promise<any> {
        return Promise.resolve()
    }
}