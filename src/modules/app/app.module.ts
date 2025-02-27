import { Module } from '@nestjs/common'
import { TransactionModule } from '../transaction/transaction.module'
import { ConfigModule } from '../config/config.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '../config/config.service'
import { BalanceModule } from '../balance/balance.module'

import { User } from '../../entities/user'
import { Transaction } from '../../entities/transaction'
import { DEFAULT_CONFIG_FILE_NAME } from '../../constants/config'

@Module({
    imports: [
        TransactionModule,
        ConfigModule.forRoot({
            fileName: process.env.CONFIG_FILE_NAME || DEFAULT_CONFIG_FILE_NAME,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                ...configService.db(),
                entities: [User, Transaction],
            }),
            inject: [ConfigService],
        }),
        BalanceModule,
    ],
})
export class AppModule {}
