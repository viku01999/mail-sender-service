import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { MailConfiguration } from "./MailConfiguration";

@Entity('sent_email')
export class SentEmail {
  @PrimaryGeneratedColumn('uuid', { name: 'sent_email_id' })
  sentEmailId!: string;

  @ManyToOne(() => MailConfiguration, (mailConfig) => mailConfig.sentEmails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mail_config_id' })
  mailConfiguration!: MailConfiguration;

  @Column({ name: 'from_email', type: 'text', nullable: false })
  fromEmail!: string;

  @Column({ name: 'to_email', type: 'text', nullable: false })
  toEmail!: string;

  @Column({ name: 'email_subject', type: 'text', nullable: true })
  emailSubject?: string;

  @Column({ name: 'email_text', type: 'text', nullable: true })
  emailText?: string;

  @Column({ name: 'email_html', type: 'text', nullable: true })
  emailHtml?: string;

  @Column('jsonb', { name: 'attachments', nullable: true })
  attachments?: object[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
