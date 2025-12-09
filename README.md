# 实验室管理系统

软件设计与构造，小组作业。

## 环境要求

- node.js

- npm

- MySQL 数据库

### 安装依赖

```bash
npm install
```

## 数据库配置

修改 `./dataBase/db.js` 中的配置信息。

```JavaScript
const db = mysql.createPool({
    host: 'localhost',
    user: '你的MySQL用户名',
    password: '你的密码',
    database: '你的数据库名称',
});
```

### 初始化表结构

（更新中）

## 启动

```bash
npm start
```

默认端口号为 `3000`，服务启动后，访问 http://localhost:3000

## API 说明

### 用户认证 (./routes/auth.js)

| 方法 | 路径               | 请求体                          | 描述                                     |
| ---- | ------------------ | ------------------------------- | ---------------------------------------- |
| POST | /api/auth/register | `{ username, password, email }` | 用户注册，用户名唯一，密码加密存储       |
| POST | /api/auth/login    | `{ username, password }`        | 用户登录，校验用户名和密码，返回登录结果 |

### 用户管理 (./routes/user.js)

| 方法   | 路径                 | 请求体                                           | 描述                                             |
| ------ | -------------------- | ------------------------------------------------ | ------------------------------------------------ |
| GET    | /api/user/all        | `{ }`                                            | 获取所有用户列表                                 |
| POST   | /api/user/add        | `{username, password, email}`                    | 添加用户（请求体包含 username, password, email） |
| PATCH  | /api/user/update/:id | `{ email, password }` 可仅传入 email 或 password | 修改用户信息（只能修改邮箱和密码）               |
| DELETE | /api/user/delete     | `{ id }` 一个 id 数组，可支持删多个用户          | 删除用户（请求体包含 id 数组）                   |

### 实验室管理(./routes/lab.js)

| 方法   | 路径                   | 请求体                                                    | 描述           |
| ------ | ---------------------- | --------------------------------------------------------- | -------------- |
| GET    | /api/device/all        | `{ }`                                                     | 获取实验室列表 |
| POST   | /api/device/add        | `{ name, leader, phone, email, des }` 除 name，都可以省略 | 添加实验室     |
| PATCH  | /api/device/update/:id | `{ name, leader, phone, email, des }` 可选部分参数        | 更新实验室信息 |
| DELETE | /api/device/delete/:id | `{ }`                                                     | 删除实验室     |

### 设备管理(./routes/device.js)

| 方法   | 路径                   | 请求体                                                       | 描述         |
| ------ | ---------------------- | ------------------------------------------------------------ | ------------ |
| GET    | /api/device/all        | `{ }`                                                        | 获取设备列表 |
| POST   | /api/device/add        | `{ name, model, lab_id, status, location, purchase_time, price, description }` name 为必填 | 添加设备     |
| PATCH  | /api/device/update/:id | `{ name, model, lab_id, status, location, purchase_time, price, description }` 选部分 | 修改设备信息 |
| DELETE | /api/device/delete/:id | `{ }`                                                        | 删除设备     |

