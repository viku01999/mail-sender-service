#!/bin/bash

# Mail Sender Service - cURL Command for Form Data with Image Attachment
# Usage: ./mail-sender-service-curl-command.sh

# Replace these values with your actual data
CLIENT_ID="your-client-id"
CLIENT_SECRET="your-client-secret"
TO_EMAIL="recipient@example.com"
SUBJECT="Test Email with Image Attachment"
TEXT_BODY="This is a test email with image attachment."
HTML_BODY="<html><body><h1>Test Email</h1><p>This is a test email with image attachment.</p></body></html>"
IMAGE_PATH="/path/to/your/image.jpg"
API_URL="http://localhost:3000/api/v1/mail-sender/send-email"

# Main cURL command
curl --location "${API_URL}?toMail=${TO_EMAIL}" \
--header "clientId: ${CLIENT_ID}" \
--header "clientSecret: ${CLIENT_SECRET}" \
--form "subject=${SUBJECT}" \
--form "text=${TEXT_BODY}" \
--form "html=${HTML_BODY}" \
--form "attachments=@${IMAGE_PATH}"

# For multiple attachments, add more --form lines:
# --form "attachments=@/path/to/file1.pdf" \
# --form "attachments=@/path/to/file2.png"

# For different content types, you can specify:
# --form "attachments=@${IMAGE_PATH};type=image/jpeg"
