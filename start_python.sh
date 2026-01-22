#!/bin/bash

# Python版本启动脚本

echo "🐍 启动 Let's Meet (Python版本)"
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误：未找到 Python3，请先安装 Python3"
    exit 1
fi

echo "✅ Python版本: $(python3 --version)"
echo ""

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "📦 创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
echo "🔧 激活虚拟环境..."
source venv/bin/activate

# 检查依赖是否安装
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📦 安装依赖..."
    echo "   如果遇到版本问题，请运行: ./install_deps.sh"
    pip3 install Flask flask-cors requests || {
        echo ""
        echo "❌ 安装失败，尝试使用兼容方式..."
        ./install_deps.sh
    }
fi

# 检查API Key配置
if grep -q "YOUR_AMAP_KEY" server.py; then
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
echo ""
echo "🚀 启动服务器..."
echo ""
python3 server.py