# Mail Sender Service - Deployment Script

## Overview

The `deploy.sh` script automates the deployment of the mail-sender-service to a remote server using Podman.

## Prerequisites

1. **SSH access** to the deployment server (`s1`)
2. **Podman** installed on the server
3. **Git** repository initialized (for version tagging)
4. **Environment file** (`.env`) on the server at `/opt/mail-sender/.env`

## Server Setup

### 1. Create Application Directory

On the server (`s1`):

```bash
sudo mkdir -p /opt/mail-sender
sudo chown $USER:$USER /opt/mail-sender
```

### 2. Create Environment File

```bash
cat > /opt/mail-sender/.env <<'EOF'
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@sudosys.org

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# API Key
API_KEY=04ff3260bcbdcd020867bae8c7014bf1:3bfdc98bc72497d3dc9d2568a813d4c192af8bc8472f680f435427d752e0e393

# Database Configuration
DB_HOST=10.8.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=notification

# Node Environment
NODE_ENV=production
EOF
```

### 3. Create Internal Network

On the server:

```bash
podman network create sudosys-internal
```

## Deployment

### Run Deployment

From your local machine:

```bash
./deploy.sh
```

### What the Script Does

1. **Builds** the container image with git commit hash as tag
2. **Saves** the image to a tar file
3. **Copies** the tar file to the server
4. **Loads** the image on the server
5. **Creates** internal network if it doesn't exist
6. **Stops** and removes old container
7. **Starts** new container with:
   - Internal network only (no exposed ports)
   - Health checks
   - Resource limits (1 CPU, 512MB RAM)
   - Log rotation
   - Auto-restart policy
8. **Verifies** health status
9. **Cleans up** old images (keeps last 3)

## Configuration

Edit the script to customize:

```bash
APP="mail-sender"              # Application name
IMAGE="mail-sender-service"    # Image name
SERVER="s1"                    # SSH server alias
APP_DIR="/opt/mail-sender"     # Server directory
NETWORK="sudosys-internal"     # Podman network
```

## SSH Configuration

Add to `~/.ssh/config`:

```
Host s1
    HostName your-server.com
    User your-username
    IdentityFile ~/.ssh/id_rsa
```

## Monitoring

### Check Service Status

```bash
ssh s1 'podman ps | grep mail-sender'
```

### View Logs

```bash
ssh s1 'podman logs -f mail-sender-service'
```

### Check Health

```bash
ssh s1 'podman healthcheck run mail-sender-service'
```

### Inspect Container

```bash
ssh s1 'podman inspect mail-sender-service'
```

## Rollback

To rollback to a previous version:

```bash
# List available images
ssh s1 'podman images | grep mail-sender-service'

# Stop current container
ssh s1 'podman stop mail-sender-service && podman rm mail-sender-service'

# Start with previous tag
ssh s1 'podman run -d --name mail-sender-service --network sudosys-internal --env-file /opt/mail-sender/.env mail-sender-service:PREVIOUS_TAG'
```

## Troubleshooting

### Deployment fails at build

- Check Containerfile syntax
- Ensure all dependencies are in package.json
- Verify TypeScript compiles: `pnpm run build`

### Image transfer fails

- Check SSH connection: `ssh s1 echo "OK"`
- Verify disk space on server: `ssh s1 df -h`
- Check network connectivity

### Container won't start

- Check logs: `ssh s1 'podman logs mail-sender-service'`
- Verify environment file exists: `ssh s1 'cat /opt/mail-sender/.env'`
- Check network exists: `ssh s1 'podman network ls | grep sudosys-internal'`

### Health check fails

- Check application logs for errors
- Verify port 3000 is listening: `ssh s1 'podman exec mail-sender-service netstat -tlnp'`
- Test health endpoint manually: `ssh s1 'podman exec mail-sender-service curl http://localhost:3000/health'`

## Integration with IAM Gateway

After deployment, update IAM Gateway to use the internal service:

1. Ensure IAM Gateway is on the same `sudosys-internal` network
2. Use production profile: `-Dspring.profiles.active=prod`
3. Service will be accessible at: `http://mail-sender-service:3000`

## Security Notes

- Service is **NOT** exposed to the internet
- Only accessible from containers on `sudosys-internal` network
- Environment variables stored securely on server
- API key required for all requests
- Logs automatically rotated to prevent disk fill

## Maintenance

### Update Environment Variables

```bash
ssh s1 'nano /opt/mail-sender/.env'
ssh s1 'podman restart mail-sender-service'
```

### Clean Up Old Images

```bash
ssh s1 'podman image prune -a -f'
```

### View Resource Usage

```bash
ssh s1 'podman stats mail-sender-service'
```
