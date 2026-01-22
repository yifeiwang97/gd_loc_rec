# Let's Meet - Python版本使用指南

## 快速开始

### 1. 安装Python依赖

```bash
# 创建虚拟环境（推荐）
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# 或
venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt
```

### 2. 配置高德地图API Key

**方法一：环境变量（推荐）**
```bash
export AMAP_KEY=your_amap_api_key
```

**方法二：直接修改文件**
编辑 `server.py` 第15行：
```python
AMAP_KEY = 'your_amap_api_key'
```

### 3. 启动服务器

**使用启动脚本（推荐）：**
```bash
./start_python.sh
```

**或手动启动：**
```bash
python3 server.py
```

服务器将在 `http://localhost:3000` 启动

### 4. 打开网页

**方法一：直接打开HTML文件（推荐）**
- 在Finder中找到 `index.html` 文件
- 双击打开，或在浏览器中右键选择"打开方式"
- 确保后端服务器正在运行（步骤3）

**方法二：使用静态文件服务器**
```bash
# 在另一个终端运行
python3 serve_static.py
# 然后访问 http://localhost:8080
```

**方法三：一键启动（后端+前端）**
```bash
./start_all.sh
# 会自动启动后端和前端服务器
```

## Python版本 vs Node.js版本

### 优势
- ✅ 无需处理Node.js版本兼容性问题
- ✅ Python环境更稳定
- ✅ 代码更简洁易读
- ✅ 错误处理更完善

### 功能对比
两个版本功能完全相同，都使用高德地图API获取真实数据。

## 依赖说明

- **Flask**: Web框架
- **flask-cors**: 跨域支持
- **requests**: HTTP请求库

## 常见问题

### Q: 如何检查Python版本？
```bash
python3 --version
```
需要 Python 3.7 或更高版本。

### Q: 虚拟环境是什么？
虚拟环境可以隔离项目依赖，避免与其他Python项目冲突。推荐使用。

### Q: 如何停止服务器？
在运行服务器的终端按 `Ctrl+C`

### Q: 端口被占用怎么办？
```bash
# 使用其他端口
PORT=3001 python3 server.py
```

然后修改 `app.js` 中的API地址为 `http://localhost:3001/api/search`

## 开发模式

启动时会自动启用调试模式，代码修改后会自动重载。

## API接口

### POST /api/search

请求体：
```json
{
  "location1": "三里屯,北京",
  "location2": "国贸,北京"
}
```

响应：
```json
{
  "user1Location": {"lng": 116.xxx, "lat": 39.xxx},
  "user2Location": {"lng": 116.xxx, "lat": 39.xxx},
  "recommendations": [...]
}
```

## 故障排除

如果遇到问题，请检查：
1. Python版本是否正确（需要3.7+）
2. 依赖是否安装完整
3. API Key是否配置正确
4. 网络连接是否正常
5. 端口3000是否被占用