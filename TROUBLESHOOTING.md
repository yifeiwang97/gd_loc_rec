# 故障排除指南

## 错误：Unexpected token '<', "<!DOCTYPE "... is not valid JSON

这个错误表示后端服务器返回了HTML而不是JSON。常见原因和解决方法：

### 原因1：后端服务器未运行

**解决方法：**
```bash
# 1. 进入项目目录
cd /Users/feifei/work/self-interest/letsmeet

# 2. 启动服务器
npm start
```

**验证服务器是否运行：**
- 打开浏览器访问：http://localhost:3000
- 应该看到JSON响应，而不是HTML页面
- 或运行：`npm run check`

### 原因2：端口被占用

如果端口3000被其他程序占用，服务器可能无法启动。

**检查端口占用：**
```bash
lsof -i:3000
```

**解决方法：**

**方法A：使用其他端口**
```bash
# 设置环境变量使用其他端口
PORT=3001 npm start
```

然后修改 `app.js` 中的API地址：
```javascript
const response = await fetch('http://localhost:3001/api/search', {
```

**方法B：停止占用端口的进程**
```bash
# 查看占用端口的进程
lsof -ti:3000

# 停止进程（替换PID为实际进程ID）
kill -9 <PID>
```

### 原因3：服务器返回了错误页面

如果服务器运行但返回HTML错误页面，可能是：
- Express路由配置问题
- 中间件错误
- 服务器崩溃

**检查方法：**
1. 查看服务器控制台输出
2. 打开浏览器开发者工具，查看Network标签
3. 检查响应内容

### 原因4：CORS问题

虽然已配置CORS，但某些情况下仍可能有问题。

**解决方法：**
确保 `server.js` 中有：
```javascript
app.use(cors());
```

### 快速诊断步骤

1. **打开测试页面**
   - 在浏览器中打开 `test_connection.html`
   - 查看连接测试结果

2. **检查服务器日志**
   - 运行 `npm start` 后查看控制台输出
   - 应该看到 "服务器运行在 http://localhost:3000"

3. **手动测试API**
   ```bash
   curl http://localhost:3000/
   ```
   应该返回JSON，而不是HTML

4. **检查浏览器控制台**
   - 按F12打开开发者工具
   - 查看Console和Network标签
   - 查看具体的错误信息

### 常见错误信息对照

| 错误信息 | 原因 | 解决方法 |
|---------|------|---------|
| `Failed to fetch` | 服务器未运行 | 运行 `npm start` |
| `Unexpected token '<'` | 返回了HTML | 检查服务器是否正常运行 |
| `CORS error` | 跨域问题 | 检查CORS配置 |
| `404 Not Found` | 路由错误 | 检查API路径是否正确 |
| `500 Internal Server Error` | 服务器内部错误 | 查看服务器日志 |

### 完整重启步骤

如果以上方法都不行，尝试完全重启：

```bash
# 1. 停止所有Node进程
pkill -f node

# 2. 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 3. 启动服务器
npm start

# 4. 在另一个终端测试
curl http://localhost:3000/
```

### 获取帮助

如果问题仍然存在，请提供：
1. 服务器控制台的完整输出
2. 浏览器控制台的错误信息
3. Network标签中的请求和响应详情