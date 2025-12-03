# 实验室管理系统

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
| GET    | /api/user/add        | `{username, password, email}`                    | 添加用户（请求体包含 username, password, email） |
| PATCH  | /api/user/update/:id | `{ email, password }` 可仅传入 email 或 password | 修改用户信息（只能修改邮箱和密码）               |
| DELETE | /api/user/delete     | `{ id }` 一个 id 数组，可支持删多个用户          | 删除用户（请求体包含 id 数组）                   |

