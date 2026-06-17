// Hermes Agent 连接测试脚本
// 使用方法：node scripts/test-hermes-connection.js

const http = require('http');

const CONFIG = {
  baseUrl: 'http://192.168.2.105:8642/V1',
  apiKey: '691b5dc834e04f39807e49f4bcb1715c98d610bed4',
  apiKeyAlt: 'e009566f4b0c875d3482c9',
};

console.log('🧪 Hermes Agent 连接测试\n');
console.log(`目标地址: ${CONFIG.baseUrl}`);
console.log('=' .repeat(50) + '\n');

// 测试1: 基本连接测试
async function testConnection() {
  console.log('📡 测试1: 基本连接...');
  
  return new Promise((resolve) => {
    const url = new URL(CONFIG.baseUrl);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + '/models',
      method: 'GET',
      timeout: 5000,
    }, (res) => {
      console.log(`   ✅ 连接成功! 状态码: ${res.statusCode}`);
      console.log(`   📋 响应头: ${JSON.stringify(res.headers, null, 2)}`);
      resolve(true);
    });

    req.on('error', (err) => {
      console.log(`   ❌ 连接失败: ${err.message}`);
      console.log(`   💡 提示: 请检查Hermes Agent是否在运行，网络是否可达`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('   ⏱️  连接超时');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// 测试2: API Key认证测试
async function testAuth() {
  console.log('\n🔐 测试2: API Key认证...');
  
  return new Promise((resolve) => {
    const url = new URL(CONFIG.baseUrl + '/chat/completions');
    const postData = JSON.stringify({
      messages: [
        { role: 'user', content: '你好，请回复"测试成功"' }
      ],
      stream: false,
      max_tokens: 50,
    });

    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ 主API Key认证成功!');
          try {
            const result = JSON.parse(data);
            console.log(`   💬 响应: ${JSON.stringify(result, null, 2)}`);
          } catch (e) {
            console.log(`   📄 原始响应: ${data}`);
          }
          resolve(true);
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          console.log('   ⚠️  主API Key认证失败，尝试备用Key...');
          testAuthWithAltKey().then(resolve);
        } else {
          console.log(`   ⚠️  状态码: ${res.statusCode}`);
          console.log(`   📄 响应: ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log(`   ❌ 请求失败: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('   ⏱️  请求超时');
      req.destroy();
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// 使用备用API Key测试
async function testAuthWithAltKey() {
  return new Promise((resolve) => {
    const url = new URL(CONFIG.baseUrl + '/chat/completions');
    const postData = JSON.stringify({
      messages: [
        { role: 'user', content: '你好，请回复"测试成功"' }
      ],
      stream: false,
      max_tokens: 50,
    });

    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.apiKeyAlt}`,
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ 备用API Key认证成功!');
          resolve(true);
        } else {
          console.log(`   ❌ 备用API Key也失败，状态码: ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log(`   ❌ 备用Key请求失败: ${err.message}`);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// 主测试流程
async function runTests() {
  const connectionOk = await testConnection();
  
  if (connectionOk) {
    await testAuth();
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 测试完成!');
  console.log('\n💡 下一步:');
  console.log('   1. 如果测试失败，检查Hermes Agent是否在 192.168.2.105:8642 运行');
  console.log('   2. 检查网络连接和防火墙设置');
  console.log('   3. 确认API Key是否正确');
  console.log('   4. 测试通过后，在Web应用中点击右下角的"AI助手"按钮测试聊天功能');
}

runTests().catch(console.error);
