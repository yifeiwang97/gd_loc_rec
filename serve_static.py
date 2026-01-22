#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
静态文件服务器 - 用于提供前端页面
"""

from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='.')

@app.route('/')
def index():
    """返回主页面"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """提供静态文件（CSS、JS、图片等）"""
    # 确保图片文件可以被正确提供
    if path.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico')):
        return send_from_directory('.', path, mimetype='image/png' if path.endswith('.png') else None)
    return send_from_directory('.', path)

if __name__ == '__main__':
    port = int(os.environ.get('STATIC_PORT', 8080))
    print(f'\n🌐 静态文件服务器运行在 http://localhost:{port}')
    print(f'📄 打开浏览器访问: http://localhost:{port}\n')
    app.run(host='0.0.0.0', port=port, debug=False)