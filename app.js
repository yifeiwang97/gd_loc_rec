// 显示加载状态
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

// 隐藏加载状态
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// 格式化距离
function formatDistance(meters) {
    if (meters < 1000) {
        return `${Math.round(meters)}米`;
    }
    return `${(meters / 1000).toFixed(1)}公里`;
}

// 获取营业状态
function getBusinessStatus(businessHours) {
    if (!businessHours) return { status: 'unknown', text: '营业时间未知' };
    
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    // 解析营业时间（格式如：09:00-22:00）
    const match = businessHours.match(/(\d{2}):(\d{2})-(\d{2}):(\d{2})/);
    if (!match) return { status: 'unknown', text: businessHours };
    
    const openTime = parseInt(match[1]) * 100 + parseInt(match[2]);
    const closeTime = parseInt(match[3]) * 100 + parseInt(match[4]);
    
    if (currentTime >= openTime && currentTime < closeTime) {
        return { status: 'open', text: '营业中' };
    } else {
        return { status: 'closed', text: '休息中' };
    }
}

// 创建店铺卡片
function createShopCard(shop, distance1, distance2) {
    const businessStatus = getBusinessStatus(shop.businessHours);
    
    const card = document.createElement('div');
    card.className = 'shop-card';
    
    // 处理tags：可能是字符串、数组或其他类型
    let tags = [];
    if (shop.tags) {
        if (typeof shop.tags === 'string') {
            tags = shop.tags.split(';').filter(t => t.trim()).slice(0, 3);
        } else if (Array.isArray(shop.tags)) {
            tags = shop.tags.filter(t => t).slice(0, 3);
        } else {
            // 其他类型，尝试转换为字符串
            tags = String(shop.tags).split(';').filter(t => t.trim()).slice(0, 3);
        }
    }
    
    card.innerHTML = `
        <div class="shop-header">
            <div class="shop-name">${shop.name || '未知店铺'}</div>
            <div class="shop-badges">
                ${shop.rating ? `
                    <div class="rating-badge">
                        ⭐ ${String(shop.rating)}
                    </div>
                ` : ''}
                <div class="status-badge ${businessStatus.status === 'open' ? 'status-open' : 'status-closed'}">
                    ${businessStatus.text}
                </div>
            </div>
        </div>
        <div class="shop-info">
            ${tags.length > 0 ? `
                <div class="shop-tags">
                    ${tags.map(tag => `<span class="tag">${String(tag).trim()}</span>`).join('')}
                </div>
            ` : ''}
            ${shop.address ? `
                <div class="info-row">
                    <span class="info-label">📍 地址：</span>
                    <span class="info-value">${String(shop.address)}</span>
                </div>
            ` : ''}
            ${shop.businessHours ? `
                <div class="info-row">
                    <span class="info-label">🕐 营业：</span>
                    <span class="info-value">${String(shop.businessHours)}</span>
                </div>
            ` : ''}
            ${shop.cost ? `
                <div class="info-row">
                    <span class="info-label">💰 客单价：</span>
                    <span class="info-value">${String(shop.cost)}</span>
                </div>
            ` : ''}
            ${shop.recommendedDishes ? `
                <div class="info-row">
                    <span class="info-label">🍽️ 推荐菜：</span>
                    <span class="info-value">${String(shop.recommendedDishes)}</span>
                </div>
            ` : ''}
        </div>
        <div class="distance-info">
            <div class="distance-item">
                <div class="distance-label">距用户A</div>
                <div class="distance-value">${formatDistance(distance1)}</div>
            </div>
            <div class="distance-item">
                <div class="distance-label">距用户B</div>
                <div class="distance-value">${formatDistance(distance2)}</div>
            </div>
            <div class="distance-item">
                <div class="distance-label">总距离</div>
                <div class="distance-value">${formatDistance(distance1 + distance2)}</div>
            </div>
        </div>
    `;
    
    return card;
}

// 搜索集合地点
async function searchMeetingPlaces() {
    const location1 = document.getElementById('location1').value.trim();
    const location2 = document.getElementById('location2').value.trim();
    
    if (!location1 || !location2) {
        alert('请输入两个地点');
        return;
    }
    
    showLoading();
    
    try {
        // 调用后端API
        const response = await fetch('http://localhost:3000/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location1: location1 + ',北京',
                location2: location2 + ',北京'
            })
        });
        
        // 检查响应内容类型
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // 如果返回的不是JSON，可能是HTML错误页面
            const text = await response.text();
            if (text.includes('<!DOCTYPE') || text.includes('<html')) {
                throw new Error('后端服务器未正确运行。请确保已运行: python3 server.py');
            }
            throw new Error('服务器返回了非JSON响应: ' + text.substring(0, 100));
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `服务器错误: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 清空之前的结果
        document.getElementById('resultsList').innerHTML = '';
        
        // 显示推荐地点
        if (data.recommendations && data.recommendations.length > 0) {
            data.recommendations.forEach((shop, index) => {
                const card = createShopCard(shop, shop.distance1 || 0, shop.distance2 || 0);
                document.getElementById('resultsList').appendChild(card);
            });
            
            document.getElementById('resultsSection').style.display = 'block';
        } else {
            alert('未找到合适的集合地点，请尝试其他地点');
        }
    } catch (error) {
        console.error('搜索错误:', error);
        let errorMessage = '搜索失败：' + error.message;
        
        // 更详细的错误提示
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('fetch')) {
            errorMessage = '无法连接到后端服务器！\n\n请确保：\n1. 后端服务器已启动（运行: python3 server.py）\n2. 服务器运行在 http://localhost:3000\n3. 网络连接正常';
        } else if (error.message.includes('后端服务器未正确运行')) {
            errorMessage = error.message;
        } else if (error.message.includes('Unexpected token')) {
            errorMessage = '服务器返回了错误格式的数据。\n\n可能原因：\n1. 后端服务器未运行\n2. API路径不正确\n3. 服务器返回了HTML而不是JSON\n\n请检查后端服务器是否正常运行（python3 server.py）';
        }
        
        alert(errorMessage);
    } finally {
        hideLoading();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchBtn').addEventListener('click', searchMeetingPlaces);
    
    // 支持回车键搜索
    document.getElementById('location1').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMeetingPlaces();
    });
    document.getElementById('location2').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMeetingPlaces();
    });
});