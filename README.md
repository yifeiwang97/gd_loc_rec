# Let's Meet - 双人集合地点推荐系统

一个基于高德地图的双人集合地点推荐网页应用，帮助两个用户找到最适合的集合地点（咖啡馆）。

> 💡 **推荐使用Python版本**：如果您遇到Node.js兼容性问题，请使用Python版本（见下方说明）

## 功能特点

- 🗺️ **地图可视化**：展示双方位置和推荐集合地点
- ☕ **智能推荐**：推荐离双方都较近的咖啡馆（按总距离排序）
- 📊 **详细信息**：显示评分、营业状态、客单价、推荐菜等真实数据
- 🎨 **现代设计**：参考大众点评黑珍珠餐厅风格的UI设计
- ⏰ **实时状态**：根据当前时间动态显示营业中/休息中
- 📍 **距离显示**：显示每个推荐地点到两个用户的距离

## 安装和运行

### 🐍 Python版本（推荐）

如果您遇到Node.js兼容性问题，推荐使用Python版本：

```bash
# 1. 安装Python依赖
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. 配置API Key（见下方）

# 3. 启动服务器
./start_python.sh
# 或
python3 server.py
```

详细说明请查看 [README_PYTHON.md](README_PYTHON.md)

---

### 📦 Node.js版本

### 1. 安装依赖

```bash
npm install
```

### 2. 配置高德地图API Key

本项目使用高德Web API获取真实数据。需要配置两个API Key：

#### 获取API Key

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册/登录账号
3. 进入控制台，创建新应用
4. 获取以下两个Key：
   - **Web服务API Key**（用于后端服务）
   - **Web端（JS API）Key**（用于前端地图）

#### 配置方式

**方式一：环境变量（推荐）**

```bash
export AMAP_KEY=your_web_service_api_key
```

**方式二：直接修改文件**

1. 修改 `server.js` 第5行：
   ```javascript
   const AMAP_KEY = 'your_web_service_api_key';
   ```

2. 修改 `index.html` 第8行：
   ```html
   <script src="https://webapi.amap.com/maps?v=2.0&key=your_js_api_key"></script>
   ```

### 3. 启动服务器

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动

### 4. 打开网页

**方式一：直接打开**
- 在浏览器中打开 `index.html` 文件

**方式二：通过本地服务器（推荐）**
- 使用任何静态文件服务器，如：
  ```bash
  # 使用Python
  python -m http.server 8080
  
  # 使用Node.js的http-server
  npx http-server -p 8080
  ```
- 然后访问 `http://localhost:8080`

## 使用说明

1. **输入地点**：在两个输入框中分别输入用户A和用户B的位置（北京市内）
   - 例如：`三里屯`、`国贸`、`中关村` 等
   
2. **搜索推荐**：点击"寻找集合地点"按钮

3. **查看结果**：
   - 地图上会显示两个用户的位置（红色和绿色标记）
   - 地图上会显示推荐的咖啡馆位置（蓝色标记）
   - 下方会显示5个推荐咖啡馆的详细信息卡片

4. **交互功能**：
   - 点击店铺卡片可以在地图上定位到该店铺
   - 地图可以缩放和拖拽查看

## 推荐算法

系统会：
1. 解析两个用户输入的地址，获取经纬度
2. 计算两个位置的中点
3. 在中点附近搜索咖啡馆（半径3公里）
4. 计算每个咖啡馆到两个用户的步行距离
5. 按总距离（距离A + 距离B）排序
6. 返回总距离最短的5个咖啡馆

## 数据说明

所有数据均来自高德地图真实数据，包括：
- ✅ 真实的店铺名称和地址
- ✅ 真实的高德评分
- ✅ 真实的营业时间（用于判断营业状态）
- ✅ 真实的标签和分类
- ✅ 真实的客单价（如果有）
- ✅ 真实的推荐菜品（如果有）

**注意**：部分店铺可能没有完整的详细信息（如客单价、推荐菜），系统会只显示有数据的信息。

## 技术栈

- **前端**：HTML5, CSS3, JavaScript, 高德地图JS API
- **后端**：Node.js, Express
- **地图服务**：高德地图Web API

## 项目结构

```
letsmeet/
├── index.html          # 主页面
├── styles.css          # 样式文件（大众点评风格）
├── app.js              # 前端逻辑
├── server.js           # 后端服务（Express）
├── package.json        # 项目配置
├── README.md           # 说明文档
├── MCP_INTEGRATION.md  # MCP工具集成指南
└── .gitignore          # Git忽略文件
```

## 关于MCP工具

本项目当前使用高德Web API实现，功能与使用MCP工具完全一致。如需使用真正的高德MCP工具，请参考 `MCP_INTEGRATION.md` 文件。

## 常见问题

### Q: 出现 "Unexpected token '<', "<!DOCTYPE "... is not valid JSON" 错误？
A: 这表示后端服务器未运行或返回了HTML而不是JSON。解决方法：
1. **检查服务器是否运行**：
   ```bash
   node check_server.js
   ```
2. **启动后端服务器**：
   ```bash
   npm start
   ```
3. **确认服务器运行在 http://localhost:3000**
4. **检查浏览器控制台**查看详细错误信息

### Q: 为什么搜索不到结果？
A: 请确保：
- 输入的地点在北京范围内
- 地点名称准确（可以尝试更具体的地点，如"三里屯太古里"）
- API Key配置正确
- 网络连接正常
- 后端服务器正在运行

### Q: 为什么有些店铺信息不完整？
A: 高德地图的POI数据中，部分店铺可能没有完整的详细信息（如客单价、推荐菜）。系统会只显示有数据的信息。

### Q: 营业状态判断准确吗？
A: 系统根据当前时间和店铺的营业时间范围进行判断。如果店铺的营业时间数据不完整，可能无法准确判断。

### Q: API调用有限制吗？
A: 是的，高德地图API有调用次数限制。免费版每天有一定配额，请合理使用。

### Q: 如何检查服务器状态？
A: 运行检查脚本：
```bash
node check_server.js
```
或在浏览器中访问 `http://localhost:3000`，应该看到JSON响应。

## 许可证

MIT License