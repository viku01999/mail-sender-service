import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MailConfiguration } from "./MailConfiguration";
import { ClientSecretId } from "./ClientIdAndSecret";

@Entity('organization_details')
export class OrganizationDetails {

    @PrimaryGeneratedColumn('uuid', { name: 'organization_id' })
    organizationId!: string;

    @Column({ name: 'name', type: 'text', nullable: false })
    name!: string;

    @Column({ name: 'domain', type: 'text', nullable: true })
    domain!: string | null;

    @Column({ name: 'logo', type: 'text', nullable: true })
    logo!: string | null;

    @Column({ name: 'address', type: 'text', nullable: true })
    address: string | null = null;

    @Column({ name: 'city', type: 'text' })
    email: string | null = null

    @Column({ name: 'contact', type: 'text' })
    contact: string | null = null;

    @Column({ name: 'created_at', type: 'timestamp', nullable: false })
    createdAt!: Date

    @Column({ name: 'updated_at', type: 'timestamp', nullable: false })
    updatedAt!: Date

    @OneToMany(() => MailConfiguration, (mailconf) => mailconf.organizationDetails, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'mail_config_id' })
    mailConfigurations!: MailConfiguration[];

    @OneToOne(() => ClientSecretId, clientSecretId => clientSecretId.organizationDetails, {
        cascade: true,
        eager: true,
    })
    @JoinColumn({ name: 'client_secret_id' })
    clientSecretId!: ClientSecretId;
}
