import { Injectable, Logger } from '@nestjs/common'
import { TransactionActions } from 'src/enums/TransactionActions'
import { EntityManager } from 'typeorm'
import { NotEnoughMoney } from './errors'
import { CreateTransactionDto } from 'src/dto/createTransactionDTO'
import { TBalance, TQueryResult } from 'src/types/balance'
import IDEncoder from 'src/lib/IDEncoder'

@Injectable()
export class BalanceService {
    private readonly logger = new Logger(BalanceService.name)

    private async _calcFromDB(cr: EntityManager) {
        const result = await cr.query<TQueryResult<TBalance>>(
            `
                SELECT
                    SUM(CASE WHEN action = $1 THEN amount ELSE 0 END) -
                    SUM(CASE WHEN action = $2 THEN amount ELSE 0 END) AS balance
                FROM transactions;
            `,
            [TransactionActions.DEPOSIT, TransactionActions.WITHDRAWAL],
        )

        return result[0]['balance']
    }

    private async _getOperator(action: TransactionActions) {
        switch (action) {
            case TransactionActions.DEPOSIT:
                return '+'
            case TransactionActions.WITHDRAWAL:
                return '-'
            }
    }

    async calc(userId: string, cr: EntityManager) {
        const fromDb = await this._calcFromDB(cr)
        this.logger.debug(`Calc from DB #userId: ${userId}, #amount: ${fromDb}`)
        return fromDb
    }

    async update(
        {
            action,
            userId,
            amount,

        }: CreateTransactionDto,
        cr: EntityManager,
    ) {
        const id = IDEncoder.decode(userId)
        const operator = await this._getOperator(action)
        const result = await cr.query<TQueryResult<TBalance>[]>(
            `
            UPDATE users
            SET balance = balance ${operator} $1
                WHERE id = $2
            RETURNING balance
            `,
            [amount, id],
        )

        const balance = result[0][0]['balance']
        if (balance >= 0) {
            this.logger.log(`Update balance #userId: ${userId}, #amount: ${amount}, #balance: ${balance}`)
            return balance
        }

        this.logger.error(`There is not enough money on the balance #userId: ${id}, #amount: ${amount}, #balance: ${balance}`)
        throw new NotEnoughMoney()
    }
}
