import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('otps')
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => User, user => user.otps, { eager: true, onDelete: 'CASCADE' }) // assuming a one-to-many relation in User entity
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ unique: true })
    otp: string;
}
