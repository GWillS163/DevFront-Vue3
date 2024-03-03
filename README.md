# 关联项目
### 本项目共有三个关联项目
1. 前端
2. 后端
3. python脚本

## 本地图片映射服务器
本项目启动时，需要启动根目录下的server.js
修改main.js内的服务器配置
```js
app.provide('hostUrl', 'http://192.168.40.249:3000')
```
```bash
node server.js 
```

## 前端项目
```bash
npm run dev
```

## 后端项目
### 启动redis
### 启动后端