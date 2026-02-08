# Mail Sender Service - Podman Deployment

## Overview

This service is deployed as an internal-only container, accessible only from other containers on the `sudosys-internal` network.

## Prerequisites

1. **Podman** and **podman-compose** installed
2. **sudosys-internal** network created
3. Environment variables configured

## Setup

### 1. Create Internal Network

```bash
podman network create sudosys-internal
```

### 2. Configure Environment Variables

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env` and set:
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASS` - Your Gmail app password (not regular password)
- `API_KEY` - API key for authentication (already set)
- Database credentials if different from defaults

### 3. Build and Deploy

```bash
# Build the image
podman-compose build

# Start the service
podman-compose up -d

# Check status
podman-compose ps

# View logs
podman-compose logs -f
```

## Network Configuration

The service is configured to:
- **NOT expose** any ports to the host machine
- Only be accessible from containers on the `sudosys-internal` network
- Use internal DNS name: `mail-sender-service`

### Accessing from Other Containers

Other services on the `sudosys-internal` network can access this service at:

```
http://mail-sender-service:3000
```

Example from IAM Gateway:
```properties
mail-sender.base-url=http://mail-sender-service:3000
```

## Health Check

The container includes a health check that runs every 30 seconds:

```bash
# Check health status
podman inspect mail-sender-service | grep -A 10 Health
```

## Resource Limits

The service is configured with:
- **CPU Limit**: 1 core
- **Memory Limit**: 512MB
- **CPU Reservation**: 0.5 core
- **Memory Reservation**: 256MB

## Logs

Logs are automatically rotated:
- **Max size**: 10MB per file
- **Max files**: 3 files retained

View logs:
```bash
podman-compose logs -f mail-sender-service
```

## Updating the Service

```bash
# Pull latest code
git pull

# Rebuild and restart
podman-compose down
podman-compose build
podman-compose up -d
```

## Troubleshooting

### Service not accessible from other containers

1. Verify network exists:
```bash
podman network ls | grep sudosys-internal
```

2. Verify service is on the network:
```bash
podman inspect mail-sender-service | grep -A 5 Networks
```

3. Test from another container:
```bash
podman run --rm --network sudosys-internal alpine/curl curl http://mail-sender-service:3000/health
```

### Email not sending

1. Check Gmail app password is correct
2. Verify 2FA is enabled on Gmail account
3. Check logs for authentication errors:
```bash
podman-compose logs mail-sender-service | grep -i error
```

### Database connection issues

1. Verify database is accessible from container:
```bash
podman exec -it mail-sender-service ping 10.8.0.1
```

2. Check database credentials in `.env`

## Production Deployment

For production, consider:

1. **Use secrets management** instead of `.env` file
2. **Set up monitoring** with Prometheus/Grafana
3. **Configure log aggregation** (e.g., Loki, ELK)
4. **Add backup strategy** for database
5. **Set up alerts** for service health
6. **Use production email service** (SendGrid, AWS SES, etc.)

## Connecting IAM Gateway

Update IAM Gateway's `application.properties`:

```properties
mail-sender.base-url=http://mail-sender-service:3000
mail-sender.api-key=04ff3260bcbdcd020867bae8c7014bf1:3bfdc98bc72497d3dc9d2568a813d4c192af8bc8472f680f435427d752e0e393
```

Ensure IAM Gateway container is also on the `sudosys-internal` network.

## Security Notes

- Service is **NOT** exposed to the internet
- Only accessible from containers on the same internal network
- API key authentication required for all endpoints
- Use HTTPS in production with reverse proxy if needed
