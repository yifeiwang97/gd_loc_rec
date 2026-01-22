#!/bin/bash

# 安装Python依赖脚本（兼容旧版本pip）

echo "🐍 安装Python依赖"
echo ""

# 检查Python版本
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python版本: $PYTHON_VERSION"

# 检查pip版本
PIP_VERSION=$(pip3 --version 2>&1 | awk '{print $2}')
echo "pip版本: $PIP_VERSION"
echo ""

# 升级pip（如果需要）
echo "📦 升级pip到最新版本..."
python3 -m pip install --upgrade pip --user 2>/dev/null || pip3 install --upgrade pip --user

echo ""
echo "📥 安装项目依赖..."
echo ""

# 安装依赖
pip3 install Flask flask-cors requests

# 验证安装
echo ""
echo "✅ 验证安装..."
python3 -c "import flask; print(f'Flask版本: {flask.__version__}')" 2>/dev/null && \
python3 -c "import flask_cors; print('flask-cors: OK')" 2>/dev/null && \
python3 -c "import requests; print(f'requests版本: {requests.__version__}')" 2>/dev/null && \
echo "" && \
echo "✅ 所有依赖安装成功！" || \
echo "❌ 依赖安装可能有问题，请检查错误信息"