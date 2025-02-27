import { IsIn, IsInt, IsNumber, IsString } from 'class-validator'
import { TransactionActions } from 'src/enums/TransactionActions'

export class CreateTransactionDto {
    @IsNumber() amount: number

    @IsString() userId: string

    @IsString()
    @IsIn(Object.values(TransactionActions))
    action: TransactionActions
}
