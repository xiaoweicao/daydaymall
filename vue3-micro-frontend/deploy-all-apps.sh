#!/bin/bash
# deploy-all-apps.sh - 部署所有微前端应用

echo "🚀 开始部署微前端应用..."

# 部署主应用
echo "📦 部署主应用..."
cd main-app
npm run build
aws s3 sync dist/ s3://cdn-bucket/micro-apps/main/latest/ --delete
cd ..

# 部署认证应用
echo "🔐 部署认证应用..."
cd auth-app
npm run build
aws s3 sync dist/ s3://cdn-bucket/micro-apps/auth/latest/ --delete
cd ..

# 部署业务应用
echo "💼 部署业务应用..."
cd business-app
npm run build
aws s3 sync dist/ s3://cdn-bucket/micro-apps/business/latest/ --delete
cd ..

# 部署设置应用
echo "⚙️ 部署设置应用..."
cd settings-app
npm run build
aws s3 sync dist/ s3://cdn-bucket/micro-apps/settings/latest/ --delete
cd ..

# 更新API配置
echo "🔧 更新API配置..."
curl -X POST https://api.example.com/micro-apps/config \
  -H "Content-Type: application/json" \
  -d @micro-apps-config.json

echo "✅ 所有应用部署完成！"
echo "🌐 主应用: https://cdn.example.com/micro-apps/main/latest/"
echo "🔐 认证应用: https://cdn.example.com/micro-apps/auth/latest/"
echo "💼 业务应用: https://cdn.example.com/micro-apps/business/latest/"
echo "⚙️ 设置应用: https://cdn.example.com/micro-apps/settings/latest/"