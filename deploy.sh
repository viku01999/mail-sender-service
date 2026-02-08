#!/usr/bin/env bash
set -e

APP="mail-sender"
IMAGE="mail-sender-service"
TAG=$(git rev-parse --short HEAD)
TAR="${APP}-${TAG}.tar"
SERVER="s1"
APP_DIR="/opt/mail-sender"
NETWORK="sudosys-internal"

echo "🏗️ Building image"
podman build -t ${IMAGE}:${TAG} -f Containerfile .

echo "📦 Saving image"
rm -f ${TAR}  # Remove old tar file if exists
podman save ${IMAGE}:${TAG} -o ${TAR}

echo "📤 Copying image to server"
scp ${TAR} ${SERVER}:${APP_DIR}/

echo "📤 Copying .env file to server"
if [ -f .env ]; then
  scp .env ${SERVER}:${APP_DIR}/.env
  echo "✅ .env file copied"
else
  echo "⚠️  No .env file found locally, using server's existing .env or defaults"
fi

ssh ${SERVER} <<EOF
set -e

APP="${APP}"
IMAGE="${IMAGE}"
TAG="${TAG}"
APP_DIR="${APP_DIR}"
NETWORK="${NETWORK}"

cd \$APP_DIR

echo "📥 Loading image"
podman load -i ${TAR}

# Ensure internal network exists
if ! podman network exists \$NETWORK; then
  echo "🌐 Creating internal network: \$NETWORK"
  podman network create \$NETWORK
fi

NAME="\${APP}-service"

# Stop and remove old container if exists
if podman ps -a --format "{{.Names}}" | grep -q "^\$NAME\$"; then
  echo "🛑 Stopping old container"
  podman stop \$NAME || true
  podman rm \$NAME || true
fi

echo "▶️ Starting \$NAME"
podman run -d \\
  --name \$NAME \\
  --network \$NETWORK \\
  -p 3000:3000 \\
  --restart unless-stopped \\
  --env-file \$APP_DIR/.env \\
  --health-cmd 'node -e "require(\"http\").get(\"http://localhost:3000/health\", (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"' \\
  --health-interval 30s \\
  --health-timeout 3s \\
  --health-retries 3 \\
  --health-start-period 40s \\
  --log-driver json-file \\
  --log-opt max-size=10m \\
  --log-opt max-file=3 \\
  --cpus 1 \\
  --memory 512m \\
  \${IMAGE}:\${TAG}

echo "⏳ Waiting for startup"
sleep 10

# Check health
echo "🏥 Checking health"
if podman healthcheck run \$NAME; then
  echo "✅ Service is healthy"
else
  echo "⚠️ Service health check failed, checking logs..."
  podman logs --tail 50 \$NAME
fi

# Cleanup old images (keep last 3)
echo "🧹 Cleaning old images"
podman images --format "{{.Repository}}:{{.Tag}}" | grep "^\${IMAGE}:" | tail -n +4 | xargs -r podman rmi || true

EOF

rm -f ${TAR}

echo "✅ Deployment completed successfully"
echo "📝 Service accessible at: http://mail-sender-service:3000 (internal network only)"
