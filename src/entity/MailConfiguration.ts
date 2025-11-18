import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { OrganizationDetails } from "./OrganizationDetails";
import { SentEmail } from "./SentEmail";

@Entity('mail_configuration')
export class MailConfiguration {

    @PrimaryGeneratedColumn('uuid', { name: 'mail_config_id' })
    mailConfigId!: string;

    @Column({ name: 'host', type: 'text', nullable: false })
    host!: string;

    @Column({ name: 'port', type: 'int', nullable: false })
    port!: number;

    @Column({ name: 'is_secured', type: 'boolean', nullable: false })
    isSecured!: boolean;

    @Column({ name: 'username', type: 'text', nullable: false })
    username!: string;

    @Column({ name: 'from', type: 'text', nullable: false })
    from!: string;

    @Column({ name: 'password', type: 'text', nullable: false })
    password!: string;

    @Column('jsonb', { name: 'extra_credentials', nullable: true })
    extraCredentials!: object | null;

    @Column({ name: 'created_at', type: 'timestamp', nullable: false })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', nullable: false })
    updatedAt!: Date;

    @ManyToOne(() => OrganizationDetails, (orgDetails) => orgDetails.mailConfigurations, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'organization_id' })
    organizationDetails?: OrganizationDetails;

    @Column({ name: 'credential_type', type: 'text' })
    credentialType!: string;

    @Column({ name: 'number_of_mail_sent', type: 'int', default: 0 })
    numberOfMailSent!: number;

    @Column({ name: 'is_default_mail', type: 'boolean', default: false })
    isDefaultMail!: boolean;

    @OneToMany(() => SentEmail, (sentEmail) => sentEmail.mailConfiguration)
    sentEmails?: SentEmail[];
}
