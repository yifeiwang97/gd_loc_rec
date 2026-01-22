#!/bin/bash

# 启动完整系统（后端API + 前端页面）

echo "🚀 启动 Let's Meet 完整系统"
echo ""

# 检查后端服务器是否运行
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ 后端API服务器已在运行 (端口3000)"
else
    echo "📡 启动后端API服务器..."
    # 在后台启动后端服务器
    python3 server.py > server.log 2>&1 &
    SERVER_PID=$!
    echo "   后端服务器PID: $SERVER_PID"
    sleep 2
    
    # 检查是否启动成功
    if lsof -ti:3000 > /dev/null 2>&1; then
        echo "✅ 后端API服务器启动成功"
    else
        echo "❌ 后端API服务器启动失败，请检查 server.log"
        exit 1
    fi
fi

echo ""
echo "🌐 启动前端页面服务器..."
python3 serve_static.py

# 清理：脚本退出时停止后台服务器
trap "kill $SERVER_PID 2>/dev/null" EXIT