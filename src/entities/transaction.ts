import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { TransactionActions } from 'src/enums/TransactionActions'
import { CreateTransactionDto } from 'src/dto/createTransactionDTO'
import IDEncoder from 'src/lib/IDEncoder'

@Entity({ name: 'transactions' })
export class Transaction {
    @PrimaryGeneratedColumn() id: number

    @Column({ name: 'user_id' }) userId: number

    @Column('numeric') amount: number

    @Column() action: TransactionActions

    @Column() ts: Date
}

export const createTransactionFromDTO = (dto: CreateTransactionDto) => {
    const transaction = new Transaction()
    transaction.action = dto.action
    transaction.amount = dto.amount
    transaction.userId = IDEncoder.decode(dto.userId)

    transaction.ts = new Date()
    return transaction
}
