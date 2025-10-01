#!/bin/bash
# deploy-micro-app.sh

APP_NAME="app1"
VERSION="1.2.3"
CDN_URL="https://cdn.example.com"
S3_BUCKET="micro-apps-bucket"

echo "🚀 开始部署 ${APP_NAME} v${VERSION}..."

# 1. 构建应用
echo "📦 构建应用..."
npm run build

# 2. 生成应用信息文件
echo "📝 生成应用信息..."
cat > dist/app-info.json << EOF
{
  "name": "${APP_NAME}",
  "version": "${VERSION}",
  "buildTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "baseUrl": "${CDN_URL}/micro-apps/${APP_NAME}/v${VERSION}",
  "manifest": "$(cat dist/manifest.json | jq -c .)"
}
EOF

# 3. 上传到CDN
echo "☁️ 上传到CDN..."
aws s3 sync dist/ s3://${S3_BUCKET}/micro-apps/${APP_NAME}/v${VERSION}/ --delete

# 4. 更新latest版本
echo "🔄 更新latest版本..."
aws s3 cp dist/ s3://${S3_BUCKET}/micro-apps/${APP_NAME}/latest/ --recursive

# 5. 更新API配置
echo "🔧 更新API配置..."
curl -X POST https://api.example.com/micro-apps/${APP_NAME}/deploy \
  -H "Content-Type: application/json" \
  -d @dist/app-info.json

echo "✅ 部署完成！"
echo "📁 文件位置: ${CDN_URL}/micro-apps/${APP_NAME}/v${VERSION}/"
echo "📄 Manifest: ${CDN_URL}/micro-apps/${APP_NAME}/v${VERSION}/manifest.json"
echo "📦 应用文件: ${CDN_URL}/micro-apps/${APP_NAME}/v${VERSION}/micro-app.umd.js"