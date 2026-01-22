const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 高德地图API Key - 请替换为您的实际Key
const AMAP_KEY = process.env.AMAP_KEY || 'YOUR_AMAP_KEY';

// 地址转经纬度
async function geocodeAddress(address) {
    const response = await fetch(
        `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=${AMAP_KEY}`
    );
    const data = await response.json();
    if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
        const [lng, lat] = data.geocodes[0].location.split(',');
        return { lng: parseFloat(lng), lat: parseFloat(lat) };
    }
    throw new Error('地址解析失败: ' + (data.info || '未知错误'));
}

// 搜索POI（咖啡馆）
async function searchPOI(keywords, location, radius = 5000) {
    const response = await fetch(
        `https://restapi.amap.com/v3/place/around?key=${AMAP_KEY}&location=${location.lng},${location.lat}&keywords=${encodeURIComponent(keywords)}&radius=${radius}&types=050000&offset=20`
    );
    const data = await response.json();
    if (data.status === '1' && data.pois) {
        return data.pois.map(poi => ({
            id: poi.id,
            name: poi.name,
            location: {
                lng: parseFloat(poi.location.split(',')[0]),
                lat: parseFloat(poi.location.split(',')[1])
            },
            address: poi.address || poi.pname + poi.cityname + poi.adname + poi.address,
            tel: poi.tel,
            distance: parseFloat(poi.distance || 0)
        }));
    }
    return [];
}

// 获取POI详细信息
async function getPOIDetail(poiId) {
    const response = await fetch(
        `https://restapi.amap.com/v3/place/detail?key=${AMAP_KEY}&id=${poiId}`
    );
    const data = await response.json();
    if (data.status === '1' && data.pois && data.pois.length > 0) {
        const poi = data.pois[0];
        return {
            rating: poi.rating || null,
            businessHours: poi.business_time || null,
            cost: poi.cost || null,
            tags: poi.tag || null,
            recommendedDishes: poi.recommend || null
        };
    }
    return {};
}

// 计算距离（步行距离）
async function calculateDistance(origin, destination) {
    const response = await fetch(
        `https://restapi.amap.com/v3/distance?key=${AMAP_KEY}&origins=${origin.lng},${origin.lat}&destination=${destination.lng},${destination.lat}&type=3`
    );
    const data = await response.json();
    if (data.status === '1' && data.results && data.results.length > 0) {
        return parseFloat(data.results[0].distance);
    }
    // 如果API失败，使用球面距离计算
    return calculateSphericalDistance(origin, destination);
}

// 球面距离计算（Haversine公式）
function calculateSphericalDistance(origin, destination) {
    const R = 6371000; // 地球半径（米）
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLng = (destination.lng - origin.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// 计算中点
function calculateMidpoint(loc1, loc2) {
    return {
        lng: (loc1.lng + loc2.lng) / 2,
        lat: (loc1.lat + loc2.lat) / 2
    };
}

// 主搜索接口
app.post('/api/search', async (req, res) => {
    try {
        console.log('收到搜索请求:', req.body);
        const { location1, location2 } = req.body;
        
        if (!location1 || !location2) {
            return res.status(400).json({ error: '请提供两个地点' });
        }
        
        // 1. 解析两个地址
        const user1Location = await geocodeAddress(location1);
        const user2Location = await geocodeAddress(location2);
        
        // 2. 计算中点
        const midpoint = calculateMidpoint(user1Location, user2Location);
        
        // 3. 搜索中点附近的咖啡馆
        const cafes = await searchPOI('咖啡馆', midpoint, 3000);
        
        // 4. 计算每个咖啡馆到两个用户的距离
        const recommendations = [];
        for (const cafe of cafes.slice(0, 10)) { // 限制处理数量
            const distance1 = await calculateDistance(user1Location, cafe.location);
            const distance2 = await calculateDistance(user2Location, cafe.location);
            
            // 获取详细信息
            const details = await getPOIDetail(cafe.id);
            
            recommendations.push({
                ...cafe,
                ...details,
                distance1,
                distance2,
                totalDistance: distance1 + distance2
            });
        }
        
        // 5. 按总距离排序，选择最优的5个
        recommendations.sort((a, b) => a.totalDistance - b.totalDistance);
        const topRecommendations = recommendations.slice(0, 5);
        
        console.log(`搜索完成，找到 ${topRecommendations.length} 个推荐地点`);
        res.json({
            user1Location,
            user2Location,
            recommendations: topRecommendations
        });
    } catch (error) {
        console.error('搜索错误:', error);
        console.error('错误堆栈:', error.stack);
        // 确保返回JSON格式的错误
        res.status(500).json({ 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📡 API端点: http://localhost:${PORT}/api/search\n`);
    if (AMAP_KEY === 'YOUR_AMAP_KEY') {
        console.warn('⚠️  警告：请配置高德地图API Key！');
        console.warn('   方法1: 设置环境变量 AMAP_KEY=your_key');
        console.warn('   方法2: 直接修改 server.js 中的 AMAP_KEY 变量\n');
    } else {
        console.log('✅ 高德地图API Key已配置\n');
    }
});

// 添加根路径，用于检查服务器是否运行
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Let\'s Meet API 服务器运行中',
        endpoints: {
            search: 'POST /api/search'
        }
    });
});