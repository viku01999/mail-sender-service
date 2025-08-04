# Mail Sender Service - Form Data Request Guide

## Overview
This guide provides complete instructions for creating a Postman request body for form-data that includes image attachments and other fields for the `/send-email` endpoint.

## Endpoint Details
- **URL**: `POST /api/v1/mail-sender/send-email`
- **Content-Type**: `multipart/form-data`
- **Authentication**: Headers-based (clientId, clientSecret)

## Required Headers
```http
clientId: your-client-id
clientSecret: your-client-secret
```

## Query Parameters
```http
toMail: recipient@example.com
```

## Form Data Fields

### Required Text Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `subject` | text | Email subject line | "Test Email with Image Attachment" |
| `text` | text | Plain text body | "This is a test email..." |
| `html` | text | HTML body (optional) | "<html><body>...</body></html>" |

### File Upload Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `attachments` | file | Image/document files | sample-image.jpg |

## Postman Configuration Steps

1. **Create New Request**
   - Method: POST
   - URL: `http://localhost:3000/api/v1/mail-sender/send-email?toMail=recipient@example.com`

2. **Set Headers**
   - Add `clientId` and `clientSecret` as text headers

3. **Configure Body**
   - Select `form-data`
   - Add text fields: subject, text, html
   - Add file field: attachments (select your image file)

4. **Send Request**

## Example Form Data Structure

### Single Image Attachment
```json
{
  "subject": "Test Email with Image",
  "text": "Plain text content",
  "html": "<h1>HTML content</h1>",
  "attachments": "@image.jpg"
}
```

### Multiple Attachments
```json
{
  "subject": "Test Email with Multiple Files",
  "text": "Multiple attachments test",
  "html": "<h1>Multiple files</h1>",
  "attachments": ["@image1.jpg", "@document.pdf", "@image2.png"]
}
```

## Testing Examples

### Test with Sample Data
```bash
# Using cURL
./mail-sender-service-curl-command.sh

# Using Postman
# Import mail-sender-service-postman-form-data.json
```

### Test with Different File Types
- Images: .jpg, .png, .gif, .svg
- Documents: .pdf, .docx, .txt
- Archives: .zip, .rar

## Common Issues and Solutions

1. **File Size Limit**: Ensure files are under server upload limits
2. **Content-Type**: Use proper MIME types for files
3. **Authentication**: Verify clientId and clientSecret are correct
4. **Required Fields**: Ensure subject and at least one body field (text/html) are provided

## Files Created
- `mail-sender-service-postman-form-data.json` - Postman collection
- `mail-sender-service-curl-command.sh` - cURL script
- `README-FORM-DATA-REQUEST.md` - This guide

## Quick Start
1. Import the Postman collection
2. Update client credentials
3. Select your image file
4. Send the request
