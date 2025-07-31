import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrganizationDetails } from "./OrganizationDetails";





@Entity('client_secret_id')
export class ClientSecretId {

    @PrimaryGeneratedColumn('uuid', { name: 'client_secret_id' })
    clientSecretId!: string;

    @Column({ name: 'client_id', type: 'text', unique: true })
    clientId!: string;

    @Column({ name: 'client_secret', type: 'text', unique: true })
    clientSecret!: string;

    @OneToOne(type => OrganizationDetails, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organization_id' })
    organizationDetails!: OrganizationDetails

}