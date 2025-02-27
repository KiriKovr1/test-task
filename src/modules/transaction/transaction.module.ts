import { Module } from '@nestjs/common'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entities/user'
import { Transaction } from 'src/entities/transaction'
import { BalanceModule } from 'src/modules/balance/balance.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Transaction]),
        BalanceModule,
    ],
    controllers: [TransactionController],
    providers: [TransactionService],
})
export class TransactionModule {}
