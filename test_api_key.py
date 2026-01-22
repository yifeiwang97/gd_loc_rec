#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试高德地图API Key是否有效
"""

import requests
import sys

def test_api_key(api_key):
    """测试API Key是否有效"""
    print(f"🔍 测试API Key: {api_key[:10]}...")
    print()
    
    # 测试地址解析API
    url = 'https://restapi.amap.com/v3/geocode/geo'
    params = {
        'address': '北京',
        'key': api_key
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        status = data.get('status')
        info = data.get('info', '')
        
        if status == '1':
            print('✅ API Key有效！')
            print(f'   状态: {info}')
            if data.get('geocodes'):
                print(f'   测试地址解析成功')
            return True
        else:
            print('❌ API Key无效或类型不正确')
            print(f'   错误信息: {info}')
            print()
            if 'INVALID_USER_KEY' in info:
                print('💡 可能的原因：')
                print('   1. Key未配置或配置错误')
                print('   2. 使用的是JS API Key而不是Web服务API Key')
                print('   3. Key未启用Web服务权限')
                print()
                print('📖 解决方法：')
                print('   1. 访问 https://lbs.amap.com/')
                print('   2. 进入控制台 -> 应用管理')
                print('   3. 创建应用并添加"Web服务"类型的Key')
                print('   4. 将Web服务API Key配置到 server.py')
            return False
    except Exception as e:
        print(f'❌ 测试失败: {e}')
        return False

if __name__ == '__main__':
    # 从server.py读取Key
    try:
        with open('server.py', 'r', encoding='utf-8') as f:
            content = f.read()
            # 查找AMAP_KEY配置
            import re
            match = re.search(r"AMAP_KEY\s*=\s*os\.environ\.get\(['\"]AMAP_KEY['\"],\s*['\"]([^'\"]+)['\"]\)", content)
            if match:
                api_key = match.group(1)
            else:
                # 尝试直接赋值格式
                match = re.search(r"AMAP_KEY\s*=\s*['\"]([^'\"]+)['\"]", content)
                if match:
                    api_key = match.group(1)
                else:
                    print('❌ 无法从server.py读取API Key')
                    sys.exit(1)
    except Exception as e:
        print(f'❌ 读取server.py失败: {e}')
        sys.exit(1)
    
    if api_key == 'YOUR_AMAP_KEY':
        print('❌ API Key未配置')
        print('   请在server.py中配置AMAP_KEY')
        sys.exit(1)
    
    success = test_api_key(api_key)
    sys.exit(0 if success else 1)