# 修复 Node.js 兼容性问题

## 问题说明
您的系统是 macOS 11.7.10 (Big Sur)，但当前安装的 Node.js 是为 macOS 13.5 (Ventura) 构建的，导致版本不兼容。

## 解决方案

### 方案一：使用 nvm 安装兼容版本（推荐）

1. **安装 nvm（如果还没有）**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **重新加载 shell 配置**
   ```bash
   source ~/.zshrc
   # 或者
   source ~/.bash_profile
   ```

3. **安装兼容的 Node.js 版本**
   ```bash
   # 安装 LTS 版本（推荐，兼容 macOS 11）
   nvm install --lts
   
   # 或者安装特定版本
   nvm install 18.20.0
   ```

4. **使用新安装的版本**
   ```bash
   nvm use --lts
   # 或
   nvm use 18.20.0
   ```

5. **设置为默认版本**
   ```bash
   nvm alias default node
   ```

6. **验证安装**
   ```bash
   node --version
   npm --version
   ```

### 方案二：使用 Homebrew 重新安装

1. **卸载当前的 Node.js**
   ```bash
   sudo rm -rf /usr/local/bin/node
   sudo rm -rf /usr/local/bin/npm
   sudo rm -rf /usr/local/lib/node_modules
   ```

2. **使用 Homebrew 安装**
   ```bash
   brew install node@18
   ```

3. **如果 Homebrew 没有安装，先安装 Homebrew**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

### 方案三：从 Node.js 官网下载

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 macOS 11 (Big Sur) 兼容的版本（建议使用 LTS 版本）
3. 安装下载的 .pkg 文件
4. 重启终端

## 验证修复

安装完成后，运行以下命令验证：

```bash
node --version
npm --version
```

如果都能正常显示版本号，说明问题已解决。

## 然后继续项目安装

```bash
cd /Users/feifei/work/self-interest/letsmeet
npm install
npm start
```

## 推荐版本

对于 macOS 11.7.10，推荐使用：
- Node.js 16.x LTS（长期支持版本）
- Node.js 18.x LTS（较新版本，通常也兼容）

避免使用 Node.js 20+，可能不完全兼容 macOS 11。