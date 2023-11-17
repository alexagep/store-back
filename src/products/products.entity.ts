import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity('Products')
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false }) // change type to varchar
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date | string;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | string;

  @ManyToOne(() => Users, (user) => user.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Users;
}
