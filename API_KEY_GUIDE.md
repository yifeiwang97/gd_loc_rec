# 高德地图API Key配置指南

## 问题说明

高德地图需要**两个**API Key：
1. **Web端（JS API）Key** - 用于前端地图显示（已配置在 index.html）
2. **Web服务API Key** - 用于后端API调用（需要配置在 server.py）

## 错误信息

如果看到 `INVALID_USER_KEY` 错误，说明：
- Web服务API Key未配置或无效
- API Key类型不正确（使用了JS API Key而不是Web服务API Key）

## 解决方案

### 方法一：使用同一个Key（如果支持）

如果您的API Key同时支持JS API和Web服务，可以直接使用：

**在 server.py 中配置：**
```python
AMAP_KEY = '010cddd40d16a82dc3d1e70373bc393e'
```

### 方法二：申请Web服务API Key（推荐）

1. **访问高德开放平台**
   - 网址：https://lbs.amap.com/

2. **登录并进入控制台**
   - 使用您的账号登录

3. **创建应用**
   - 点击"应用管理" -> "我的应用"
   - 点击"创建新应用"
   - 填写应用名称（如：Let's Meet）

4. **添加Key**
   - 在应用下点击"添加"
   - **Key名称**：Web服务Key
   - **服务平台**：选择"Web服务"
   - **提交**

5. **复制Key并配置**
   - 复制生成的Web服务API Key
   - 配置到 `server.py` 第18行：
     ```python
     AMAP_KEY = 'your_web_service_api_key'
     ```

### 方法三：使用环境变量

```bash
export AMAP_KEY=your_web_service_api_key
python3 server.py
```

## 验证配置

配置完成后，重启服务器：

```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
python3 server.py
```

如果配置正确，应该看到：
```
✅ 高德地图API Key已配置
```

## 常见问题

### Q: JS API Key 和 Web服务API Key 可以共用吗？
A: 有些账号可以共用，但通常建议分别申请，因为：
- 使用场景不同
- 配额管理更灵活
- 安全性更好

### Q: 如何检查Key是否有效？
A: 访问以下URL测试（替换YOUR_KEY）：
```
https://restapi.amap.com/v3/geocode/geo?address=北京&key=YOUR_KEY
```

如果返回JSON数据，说明Key有效。

### Q: 提示"INVALID_USER_KEY"怎么办？
A: 
1. 检查Key是否正确复制（没有多余空格）
2. 确认使用的是Web服务API Key
3. 检查Key是否已启用
4. 确认Key的服务平台包含"Web服务"

## 当前配置状态

- ✅ **前端JS API Key**: 已配置在 index.html
- ⚠️ **后端Web服务API Key**: 需要配置在 server.py

请按照上述步骤配置Web服务API Key。