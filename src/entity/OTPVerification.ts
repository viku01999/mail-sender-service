import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";




@Entity({ name: 'otp_verification' })
export class OTPVerification {

    @PrimaryGeneratedColumn('uuid', { name: 'verification_id' })
    verificationId!: string;

    @Column({ name: 'email_phone', type: 'text' })
    emailOrPhone!: string;

    @Column({ name: 'valid_till', type: 'timestamptz' })
    validTill!: Date;

    @Column({ name: 'method', type: 'text' })
    method!: string;

    @Column({ name: 'otp', type: 'text' })
    otp!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date

    @Column({ name: 'is_verified', type: 'boolean', default: false })
    isVerified!: boolean

}