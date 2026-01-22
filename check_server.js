#!/usr/bin/env node

// 检查后端服务器是否运行的脚本

const http = require('http');

function checkServer() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3000', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ status: 'running', data: json });
                } catch (e) {
                    resolve({ status: 'running', data: data });
                }
            });
        });
        
        req.on('error', (err) => {
            reject({ status: 'not_running', error: err.message });
        });
        
        req.setTimeout(3000, () => {
            req.destroy();
            reject({ status: 'timeout', error: '连接超时' });
        });
    });
}

checkServer()
    .then(result => {
        console.log('✅ 后端服务器运行正常');
        console.log('   状态:', result.status);
        if (result.data) {
            console.log('   响应:', JSON.stringify(result.data, null, 2));
        }
        process.exit(0);
    })
    .catch(err => {
        console.log('❌ 后端服务器未运行');
        console.log('   错误:', err.error || err.message);
        console.log('\n请运行以下命令启动服务器:');
        console.log('   npm start');
        process.exit(1);
    });