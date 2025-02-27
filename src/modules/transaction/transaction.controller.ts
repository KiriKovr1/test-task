import { Body, Controller, Post } from '@nestjs/common'
import { CreateTransactionDto } from 'src/dto/createTransactionDTO'
import { TransactionService } from './transaction.service'

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Post()
    public async create(@Body() createTransactionDTO: CreateTransactionDto) {
        return await this.transactionService.create(createTransactionDTO)
    }
}
