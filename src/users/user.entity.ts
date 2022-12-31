import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { AfterInsert, AfterUpdate, AfterRemove, AfterLoad } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @AfterInsert()
    logInsert() {
        console.log('User inserted with id ' + this.id)
    }

    @AfterUpdate()
    updateLog() {
        console.log('User updated with id ' + this.id)
    }

    @AfterRemove()
    removeLog() {
        console.log('User removed with id ' + this.id)
    }

    @AfterLoad()
    loadLog() {
        console.log('User loaded with id ' + this.id)
    }

}