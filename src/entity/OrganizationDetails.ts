import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MailConfiguration } from "./MailConfiguration";





@Entity('organization_details')
export class OrganizationDetails {

    @PrimaryGeneratedColumn('uuid', { name: 'organization_id' })
    organization_id!: string;

    @Column({ name: 'name', type: 'text', nullable: false })
    name!: string;

    @Column({ name: 'domain', type: 'text', nullable: true })
    domain!: string | null;

    @Column({ name: 'logo', type: 'text', nullable: true })
    logo!: string | null;

    @Column({ name: 'address', type: 'text', nullable: true })
    address: string | null = null;

    @Column({ name: 'contact', type: 'text', nullable: true })
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

}