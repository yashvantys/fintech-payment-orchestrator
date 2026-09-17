import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    amount: number;

    @Column()
    currency: string;

    @Column({ default: 'PENDING' })
    status: 'PENDING' | 'SUCCESS' | 'FAILED';

    @Column({ unique: true })
    idempotencyKey: string;

    @Column({ nullable: true })
    stripeId: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}