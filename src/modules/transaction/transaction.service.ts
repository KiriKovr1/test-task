import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { BalanceService } from 'src/modules/balance/balance.service'
import { CreateTransactionDto } from 'src/dto/createTransactionDTO'
import { createTransactionFromDTO } from 'src/entities/transaction'
import { DataSource, EntityManager } from 'typeorm'
import IDEncoder from 'src/lib/IDEncoder'

@Injectable()
export class TransactionService {
    private readonly logger = new Logger(TransactionService.name)

    constructor(
        private readonly dataSource: DataSource,
        private readonly balanceService: BalanceService,
    ) {}

    private async _save(
        qr: EntityManager,
        createTransactionDTO: CreateTransactionDto,
    ) {
        const transaction = createTransactionFromDTO(createTransactionDTO)
        const { id } = await qr.save(transaction)
        return IDEncoder.encode(id)
    }

    private _createTransaction(transaction: CreateTransactionDto) {
        return async (qr: EntityManager) => {
            const transactionId = await this._save(qr, transaction)
            const updatedBalance = await this.balanceService.update(transaction, qr)
            const balance = await this.balanceService.calc(transaction.userId, qr)

            if (updatedBalance === balance) {
                return { transactionId, balance } as const
            } else {
                this.logger.error(`Inconsistent balance data #balance: ${updatedBalance}, #calculated: ${balance}`)
                throw new InternalServerErrorException()
            }
        }
    }

    public async create(createTransactionDTO: CreateTransactionDto) {
        return await this.dataSource.transaction(
            this._createTransaction(createTransactionDTO),
        )
    }
}
