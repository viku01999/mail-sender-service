export interface CreateMailConfigurationDto {
  host: string;
  port: number;
  isSecured: boolean;
  username: string;
  password: string;
  extraCredentials?: object | null;
  credentialType: string;
}

export interface UpdateMailConfigurationDto {
  host?: string;
  port?: number;
  isSecured?: boolean;
  username?: string;
  password?: string;
  extraCredentials?: object | null;
  credentialType?: string;
  numberOfMailSent?: number;
}
