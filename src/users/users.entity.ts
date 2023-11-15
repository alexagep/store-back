import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Products } from '../products/products.entity';

@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'string', nullable: false })
  name: string;

  @Column({ type: 'string', nullable: false })
  lastName: string;

  @Column({ type: 'string', unique: true, nullable: false })
  email: string;

  @Column({ type: 'string', nullable: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @OneToMany(() => Products, (product) => product.user)
  products: Products[];
}
