# 高德MCP工具集成指南

本项目当前使用高德Web API作为实现方案。如果您想使用真正的高德MCP工具，可以按照以下方式集成。

## MCP工具说明

高德MCP提供了以下相关工具：
- `maps_geo`: 地址转经纬度
- `maps_around_search`: 周边搜索POI
- `maps_search_detail`: 获取POI详细信息
- `maps_distance`: 计算两点间距离

## 集成方式

### 方式一：在Cursor环境中直接使用

如果您在Cursor环境中开发，可以直接调用MCP工具。需要修改 `server.js` 中的相关函数：

```javascript
// 示例：使用MCP工具进行地址解析
async function geocodeAddress(address) {
    // 在Cursor环境中，可以通过MCP客户端调用
    // 实际调用方式取决于您的MCP客户端实现
    const result = await mcpClient.call('mcp_amap-maps-streamableHTTP_maps_geo', {
        address: address,
        city: '北京'
    });
    
    if (result && result.location) {
        const [lng, lat] = result.location.split(',');
        return { lng: parseFloat(lng), lat: parseFloat(lat) };
    }
    throw new Error('地址解析失败');
}
```

### 方式二：创建MCP代理服务

创建一个独立的MCP代理服务，该服务通过MCP协议与MCP服务器通信，然后为Web应用提供REST API。

## 当前实现

当前版本使用高德Web API，功能完全一致，可以直接使用。只需要：

1. 获取高德地图API Key
2. 在 `server.js` 中配置 `AMAP_KEY`
3. 在 `index.html` 中配置JS API Key

## 数据真实性

无论是使用MCP工具还是Web API，获取的数据都是高德地图的真实数据，包括：
- 真实的POI信息
- 真实的评分
- 真实的营业时间
- 真实的地址和联系方式

## 注意事项

- MCP工具需要在支持MCP的环境中运行
- Web API版本可以在任何Node.js环境中运行
- 两种方式获取的数据来源相同，结果一致