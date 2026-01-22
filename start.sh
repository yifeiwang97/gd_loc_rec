#!/bin/bash

# Let's Meet 启动脚本

echo "🚀 启动 Let's Meet 双人集合地点推荐系统"
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
fi

# 检查API Key配置
if grep -q "YOUR_AMAP_KEY" server.js; then
    echo "⚠️  警告：检测到未配置的API Key"
    echo "   请先配置高德地图API Key（参考 README.md）"
    echo ""
    read -p "是否继续启动？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 启动服务器
echo "✅ 启动后端服务器..."
node server.js