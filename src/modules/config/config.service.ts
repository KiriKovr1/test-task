import * as fs from 'node:fs'
import * as path from 'path'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

import * as merge from 'deepmerge'
import configDefault from './config.default'
import {
    MODULE_OPTIONS_TOKEN,
    TConfigOptions,
} from './config.module-definition'
import { EnvTypes } from 'src/enums/EnvTypes'

export type ServerConfig = {
    host: string
    port: number
}

export type DatabaseConfig = {
    host: string
    username: string
    password: string
    port: number
    max: number
}

export type BasicAuthConfig = {
    users: {
        [key: string]: string
    }
}

export type Config = {
    server: ServerConfig
    db: DatabaseConfig
    basicAuth?: BasicAuthConfig
}

@Injectable()
export class ConfigService {
    private readonly config: Config

    private readonly logger = new Logger(ConfigService.name)

    constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: TConfigOptions) {
        const configLocal: object = {}
        try {
            Object.assign(
                configLocal,
                JSON.parse(
                    fs
                        .readFileSync(
                            path.join(process.cwd(), options.fileName),
                        )
                        .toString('utf8'),
                ),
            )
        } catch (error) {
            this.logger.warn(`Local config error: ${error}`)
        }
        const config: Config = merge(configDefault, configLocal)
        this.config = config
    }

    get<T extends keyof Config>(key: T): Config[T] {
        return this.config[key] 
    }

    db(): TypeOrmModuleOptions {
        const { db } = this.config
        return {
            ...db,
            type: 'postgres',
            synchronize: false,
            logging: process.env.NODE_ENV === EnvTypes.DEV,
        }
    }
}
