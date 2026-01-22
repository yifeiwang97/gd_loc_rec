#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Let's Meet - 双人集合地点推荐系统
Python Flask 后端服务器
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import math

app = Flask(__name__)
CORS(app)

# 高德地图API Key - 请替换为您的实际Key
# 注意：需要Web服务API Key（与JS API Key可能不同，需要在控制台分别申请）
AMAP_KEY = os.environ.get('AMAP_KEY', '010cddd40d16a82dc3d1e70373bc393e')


def geocode_address(address):
    """地址转经纬度"""
    url = 'https://restapi.amap.com/v3/geocode/geo'
    params = {
        'address': address,
        'key': AMAP_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        if data.get('status') == '1' and data.get('geocodes'):
            location_str = data['geocodes'][0]['location']
            lng, lat = map(float, location_str.split(','))
            return {'lng': lng, 'lat': lat}
        else:
            raise Exception(f"地址解析失败: {data.get('info', '未知错误')}")
    except Exception as e:
        raise Exception(f"地址解析错误: {str(e)}")


def search_poi(keywords, location, radius=5000):
    """搜索POI（咖啡馆）"""
    url = 'https://restapi.amap.com/v3/place/around'
    params = {
        'key': AMAP_KEY,
        'location': f"{location['lng']},{location['lat']}",
        'keywords': keywords,
        'radius': radius,
        'types': '050000',  # 餐饮服务
        'offset': 20
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        if data.get('status') == '1' and data.get('pois'):
            pois = []
            for poi in data['pois']:
                location_str = poi.get('location', '')
                if location_str:
                    lng, lat = map(float, location_str.split(','))
                    pois.append({
                        'id': poi.get('id'),
                        'name': poi.get('name', ''),
                        'location': {'lng': lng, 'lat': lat},
                        'address': poi.get('address', '') or 
                                  (poi.get('pname', '') + poi.get('cityname', '') + 
                                   poi.get('adname', '') + poi.get('address', '')),
                        'tel': poi.get('tel', ''),
                        'distance': float(poi.get('distance', 0))
                    })
            return pois
        return []
    except Exception as e:
        print(f"搜索POI错误: {e}")
        return []


def get_poi_detail(poi_id):
    """获取POI详细信息"""
    url = 'https://restapi.amap.com/v3/place/detail'
    params = {
        'key': AMAP_KEY,
        'id': poi_id
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        if data.get('status') == '1' and data.get('pois'):
            poi = data['pois'][0]
            # 处理tags：确保返回字符串格式
            tags = poi.get('tag', '')
            if tags and isinstance(tags, list):
                tags = ';'.join(str(t) for t in tags if t)
            elif tags:
                tags = str(tags)
            else:
                tags = None
            
            return {
                'rating': poi.get('rating'),
                'businessHours': poi.get('business_time'),
                'cost': poi.get('cost'),
                'tags': tags,
                'recommendedDishes': poi.get('recommend')
            }
        return {}
    except Exception as e:
        print(f"获取POI详情错误: {e}")
        return {}


def calculate_distance(origin, destination, distance_type=3):
    """
    计算两点间距离
    type: 1-直线距离, 3-步行距离
    """
    url = 'https://restapi.amap.com/v3/distance'
    params = {
        'key': AMAP_KEY,
        'origins': f"{origin['lng']},{origin['lat']}",
        'destination': f"{destination['lng']},{destination['lat']}",
        'type': str(distance_type)
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        if data.get('status') == '1' and data.get('results'):
            return float(data['results'][0].get('distance', 0))
        
        # 如果API失败，使用球面距离计算
        return calculate_spherical_distance(origin, destination)
    except Exception as e:
        print(f"计算距离错误: {e}")
        return calculate_spherical_distance(origin, destination)


def calculate_spherical_distance(origin, destination):
    """球面距离计算（Haversine公式）"""
    R = 6371000  # 地球半径（米）
    d_lat = math.radians(destination['lat'] - origin['lat'])
    d_lng = math.radians(destination['lng'] - origin['lng'])
    
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(origin['lat'])) *
         math.cos(math.radians(destination['lat'])) *
         math.sin(d_lng / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c


def calculate_midpoint(loc1, loc2):
    """计算两个位置的中点"""
    return {
        'lng': (loc1['lng'] + loc2['lng']) / 2,
        'lat': (loc1['lat'] + loc2['lat']) / 2
    }


@app.route('/', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'ok',
        'message': "Let's Meet API 服务器运行中",
        'language': 'Python',
        'endpoints': {
            'search': 'POST /api/search'
        },
        'note': '这是API服务器，前端页面请直接打开 index.html 文件'
    })


@app.route('/api/search', methods=['POST'])
def search_meeting_places():
    """主搜索接口"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': '请求体为空'}), 400
        
        location1 = data.get('location1', '').strip()
        location2 = data.get('location2', '').strip()
        
        if not location1 or not location2:
            return jsonify({'error': '请提供两个地点'}), 400
        
        print(f'收到搜索请求: {location1} <-> {location2}')
        
        # 1. 解析两个地址
        user1_location = geocode_address(location1)
        user2_location = geocode_address(location2)
        
        print(f'用户A位置: {user1_location}')
        print(f'用户B位置: {user2_location}')
        
        # 2. 计算中点
        midpoint = calculate_midpoint(user1_location, user2_location)
        print(f'中点位置: {midpoint}')
        
        # 3. 搜索中点附近的咖啡馆
        cafes = search_poi('咖啡馆', midpoint, 3000)
        print(f'找到 {len(cafes)} 个咖啡馆')
        
        if not cafes:
            return jsonify({
                'user1Location': user1_location,
                'user2Location': user2_location,
                'recommendations': [],
                'message': '未找到附近的咖啡馆，请尝试其他地点'
            })
        
        # 4. 计算每个咖啡馆到两个用户的距离
        recommendations = []
        for cafe in cafes[:10]:  # 限制处理数量
            try:
                distance1 = calculate_distance(user1_location, cafe['location'], distance_type=3)
                distance2 = calculate_distance(user2_location, cafe['location'], distance_type=3)
                
                # 获取详细信息
                details = get_poi_detail(cafe['id'])
                
                recommendations.append({
                    **cafe,
                    **details,
                    'distance1': distance1,
                    'distance2': distance2,
                    'totalDistance': distance1 + distance2
                })
            except Exception as e:
                print(f"处理咖啡馆 {cafe.get('name')} 时出错: {e}")
                continue
        
        # 5. 按总距离排序，选择最优的5个
        recommendations.sort(key=lambda x: x['totalDistance'])
        top_recommendations = recommendations[:5]
        
        print(f'返回 {len(top_recommendations)} 个推荐地点')
        
        return jsonify({
            'user1Location': user1_location,
            'user2Location': user2_location,
            'recommendations': top_recommendations
        })
        
    except Exception as e:
        print(f'搜索错误: {e}')
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': str(e),
            'details': traceback.format_exc() if os.environ.get('FLASK_DEBUG') else None
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    
    print('\n' + '='*50)
    print('🚀 Let\'s Meet - 双人集合地点推荐系统')
    print('='*50)
    print(f'📡 服务器运行在 http://localhost:{port}')
    print(f'🔗 API端点: http://localhost:{port}/api/search')
    print('='*50 + '\n')
    
    if AMAP_KEY == 'YOUR_AMAP_KEY':
        print('⚠️  警告：请配置高德地图API Key！')
        print('   方法1: 设置环境变量 AMAP_KEY=your_key')
        print('   方法2: 直接修改 server.py 中的 AMAP_KEY 变量\n')
    else:
        print(f'✅ 高德地图API Key已配置: {AMAP_KEY[:10]}...')
        print('   注意：如果遇到INVALID_USER_KEY错误，')
        print('   请确保使用的是Web服务API Key（不是JS API Key）')
        print('   参考 API_KEY_GUIDE.md 获取帮助\n')
    
    app.run(host='0.0.0.0', port=port, debug=True)