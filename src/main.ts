import { Server } from 'http'
import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'

import { AppModule } from './modules/app/app.module'
import { ConfigService } from './modules/config/config.service'
import { DataSource } from 'typeorm'
import { AddressInfo } from 'net'

(async () => {
    const logger = new Logger('Main')
    const app = await NestFactory.create(AppModule)
    const dataSource = app.get(DataSource)
    
    const config = app.get(ConfigService)
    const serverConfig = config.get('server')

    app.useGlobalPipes(new ValidationPipe())
    app.setGlobalPrefix('api/v1')

    await app.listen(serverConfig.port, () => {
        const server: Server = app.getHttpServer()
        logger.log(`The server is listening at ${(server.address() as AddressInfo).address}:${(server.address() as AddressInfo).port}`)
    })

    try {
        const reason = await new Promise((resolve) => {
            process.on('SIGINT', () => resolve('interrupted'))
            process.on('SIGTERM', () => resolve('terminated'))
        })
        logger.debug(`The server is ${reason}, pid#${process.pid}, ts#${Date.now()}`)
    } finally {
        await dataSource.destroy()
        await app.close()
        logger.log('The server is disposed successfully')
    }
})()
