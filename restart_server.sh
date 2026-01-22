#!/bin/bash

# 重启服务器脚本

echo "🔄 重启后端服务器..."
echo ""

# 查找并停止占用3000端口的Node进程
echo "1. 停止现有服务器进程..."
PIDS=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PIDS" ]; then
    echo "   找到进程: $PIDS"
    echo "$PIDS" | xargs kill -9 2>/dev/null
    sleep 2
    echo "   ✅ 已停止"
else
    echo "   ℹ️  没有发现运行中的服务器"
fi

echo ""
echo "2. 等待端口释放..."
sleep 2

echo ""
echo "3. 启动新服务器..."
cd "$(dirname "$0")"
npm start