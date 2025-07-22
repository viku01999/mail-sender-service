export interface CreateOrganizationDto {
  name: string;
  domain: string;
  logo?: string;
  address?: string;
  contact?: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  domain?: string;
  logo?: string;
  address?: string;
  contact?: string;
}
