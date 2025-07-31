#!/bin/bash

: '
Endpoint: Create Organization
Method: POST
URL: /create-organizations
Headers:
  Content-Type: application/json
Request Body:
{
  "name": "Example Organization",
  "domain": "example.com",
  "logo": "",
  "address": "123 Example St",
  "city": "Example City",
  "email": "contact@example.com",
  "contact": "1234567890"
}
'

: '
Endpoint: Get All Organizations
Method: GET
URL: /organizations
Headers:
  None
Request Body:
{}
'

: '
Endpoint: Get Organization By Id
Method: GET
URL: /organizations/id?organizationId={{organizationId}}
Headers:
  None
Request Body:
{}
'

: '
Endpoint: Update Organization
Method: PUT
URL: /organizations?organizationId={{organizationId}}
Headers:
  Content-Type: application/json
Request Body:
{
  "name": "Updated Organization Name",
  "domain": "updated.com"
}
'

: '
Endpoint: Delete Organization
Method: DELETE
URL: /organizations?organizationId={{organizationId}}
Headers:
  None
Request Body:
  None
'

: '
Endpoint: Create Mail Configuration
Method: POST
URL: /mail-configurations
Headers:
  Content-Type: application/json
  clientId: {{clientId}}
  clientSecret: {{clientSecret}}
Request Body:
{
  "host": "smtp.example.com",
  "port": 587,
  "isSecured": true,
  "username": "user@example.com",
  "password": "password123",
  "credentialType": "SMTP",
  "extraCredentials": null,
  "isDefaultMail": true
}
'

: '
Endpoint: Get All Mail Configurations
Method: GET
URL: /mail-configurations
Headers:
  None
Request Body:
{}
'

: '
Endpoint: Get Mail Configuration By Id
Method: GET
URL: /mail-configurations/id?mailConfigId={{mailConfigId}}
Headers:
  None
Request Body:
{}
'

: '
Endpoint: Update Mail Configuration
Method: PUT
URL: /mail-configurations?mailConfigId={{mailConfigId}}
Headers:
  Content-Type: application/json
  clientId: {{clientId}}
  clientSecret: {{clientSecret}}
Request Body:
{
  "host": "smtp.updated.com",
  "port": 465,
  "isSecured": true,
  "username": "updateduser@example.com",
  "password": "newpassword",
  "credentialType": "SMTP",
  "extraCredentials": null,
  "isDefaultMail": false
}
'

: '
Endpoint: Make Default Mail Configuration
Method: PATCH
URL: /mail-configurations/make-default
Headers:
  Content-Type: application/json
  clientId: {{clientId}}
  clientSecret: {{clientSecret}}
Request Body:
{
  "mailConfigId": "{{mailConfigId}}"
}
'

: '
Endpoint: Delete Mail Configuration
Method: DELETE
URL: /mail-configurations?mailConfigId={{mailConfigId}}
Headers:
  clientId: {{clientId}}
  clientSecret: {{clientSecret}}
Request Body:
  None
'

: '
Endpoint: Send Email
Method: POST
URL: /send-email
Headers:
  clientId: {{clientId}}
  clientSecret: {{clientSecret}}
  mailCredentialsTypes: {{mailCredentialsTypes}}
  Content-Type: application/json
Request Body:
{
  "toMail": "recipient@example.com",
  "subject": "Test Email",
  "text": "This is a test email.",
  "html": "<p>This is a test email.</p>",
  "attachments": []
}
'
