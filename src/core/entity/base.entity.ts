import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
} from 'typeorm'

@Entity()
export class BaseEntityProsem {
	@PrimaryGeneratedColumn()
	id: string

	@Column()
	companyId: string

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	updatedAt: Date
}
