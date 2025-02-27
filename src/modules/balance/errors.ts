import { HttpException } from '@nestjs/common'
import { ErrorMessages } from 'src/enums/ErrorMessages'

export class NotEnoughMoney extends HttpException {
    constructor() {
        super(ErrorMessages.NOT_ENOUGH_MONEY, 402)
    }
}
