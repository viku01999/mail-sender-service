import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrganizationDetails } from './OrganizationDetails';

@Entity('kafka_configurations')
export class KafkaConfiguration {

  @PrimaryGeneratedColumn('uuid', {name: 'kafka_config_id'})
  kafkaConfigId!: string;

  @Column({ type: 'text', nullable: false })
  bootstrapServers!: string;

  @Column({ type: 'text', nullable: true })
  clientId?: string;

  @Column({ type: 'text', nullable: true })
  groupId?: string;

  @Column({ type: 'text', nullable: true })
  saslMechanism?: string;

  @Column({ type: 'text', nullable: true })
  saslUsername?: string;

  @Column({ type: 'text', nullable: true })
  saslPassword?: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean = false;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => OrganizationDetails, organization => organization.kafkaConfiguration, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'organizationId' })
  organization!: OrganizationDetails;

}
