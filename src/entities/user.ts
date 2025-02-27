import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Transaction } from './transaction'

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn() id: number

    @Column('numeric') balance: number
}
