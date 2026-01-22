#!/bin/bash

# Node.js 兼容性修复脚本

echo "🔧 修复 Node.js 兼容性问题"
echo "系统版本: macOS 11.7.10 (Big Sur)"
echo ""

# 检查 Homebrew
if ! command -v brew &> /dev/null; then
    echo "❌ 错误：未找到 Homebrew"
    echo "   请先安装 Homebrew:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

echo "✅ 检测到 Homebrew"
echo ""

# 备份当前 Node.js 路径
echo "📦 准备重新安装 Node.js..."
echo ""

# 使用 Homebrew 安装兼容的 Node.js 版本
echo "正在安装 Node.js 18 LTS（兼容 macOS 11）..."
brew install node@18

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Node.js 安装成功！"
    echo ""
    echo "⚠️  注意：如果 node 命令仍然不可用，请运行："
    echo "   echo 'export PATH=\"/usr/local/opt/node@18/bin:\$PATH\"' >> ~/.zshrc"
    echo "   source ~/.zshrc"
    echo ""
    echo "然后验证安装："
    echo "   node --version"
    echo "   npm --version"
else
    echo ""
    echo "❌ 安装失败，请检查错误信息"
    exit 1
fi