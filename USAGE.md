# MPS MCP 服务器使用说明

## 概述

这是一个基于 FastMCP 框架的 MCP (Model Context Protocol) 服务器，为 MPS 平台开发提供文件系统、网络通信和身份验证功能。

## 身份验证

服务器启动前会自动进行身份验证，需要设置以下环境变量：

- `MPS_USERNAME`: MPS平台用户名
- `MPS_PASSWORD`: MPS平台密码

服务器会使用这些凭据向 `https://main.test.nmhuixin.com/api/v1/auth/` 发送POST请求获取token。

## 安装依赖

```bash
pnpm install
```

## IO示例

### 1. 文件系统工具

#### 写入文件

```js
// 确保目录存在
const dir = path.dirname(args.filePath);
await fs.ensureDir(dir);

// 写入文件
await fs.writeFile(args.filePath, args.content, { encoding: args.encoding as BufferEncoding });
```

#### 读取文件

```js
const content = await fs.readFile(args.filePath, { encoding: args.encoding as BufferEncoding });
```

#### HTTP GET 请求

```js
const resp = axios.get(args.url);
```

## 运行方式

### 开发模式
```bash
pnpm dev
```

### 生产模式
```bash
pnpm build
pnpm start
```

## 错误处理

所有工具都包含完善的错误处理机制：
- 文件操作错误会返回具体的错误信息
- 网络请求错误会返回HTTP状态码和错误消息
- 所有错误都以字符串形式返回，便于AI模型理解

## 技术栈

- **FastMCP**: MCP 服务器框架
- **TypeScript**: 类型安全的 JavaScript
- **Zod**: 参数验证
- **fs-extra**: 增强的文件系统操作
- **axios**: HTTP 客户端
- **pnpm**: 包管理器

## 在其他文件中使用Token

### 导入认证模块
```typescript
import { 
  getToken
} from "./auth.js";
```

### 使用示例
```typescript
// 获取token
const token = getToken();
```

## 注意事项

1. 文件路径使用绝对路径或相对于工作目录的路径
2. 网络请求支持自定义超时时间
3. 所有工具都是异步的，返回 Promise
4. 错误处理统一返回字符串格式的错误信息
5. **必须设置环境变量 MPS_USERNAME 和 MPS_PASSWORD 才能启动服务器**
6. Token会自动管理，包括过期检查和刷新
7. 认证失败时服务器会退出并显示错误信息
