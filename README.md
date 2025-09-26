# MPS平台开发辅助MCP服务

MPS平台开发辅助MCP服务，提供系统管理、表单模板、代码生成等功能。

## 安装

```bash
# 全局安装
npm install -g mps-mcp

# 或使用npx直接运行
npx mps-mcp
```

## 环境配置

在使用前，需要设置以下环境变量：

```bash
export MPS_USERNAME="your_username"
export MPS_PASSWORD="your_password"
```

## 功能特性

- 系统管理：获取系统列表、权限树等
- 表单模板：管理表单模板定义
- 代码生成：导出前端代码模板
- 项目管理：路由和菜单管理

## 使用方法

### 作为MCP服务器运行

```bash
# 直接运行
mps-mcp

# 或使用npx
npx mps-mcp
```

### 在MCP客户端中使用

将以下配置添加到你的MCP客户端配置中：

#### 使用环境变量文件

也可以引用环境变量：

```json
{
  "mcpServers": {
    "mps-mcp": {
      "command": "mps-mcp",
      "args": [],
      "env": {
        "MPS_USERNAME": "${MPS_USERNAME}",
        "MPS_PASSWORD": "${MPS_PASSWORD}"
      }
    }
  }
}
```

> **注意**: 确保在使用前已正确设置 `MPS_USERNAME` 和 `MPS_PASSWORD` 环境变量。详细的环境变量配置说明请参考 [ENV_SETUP.md](./ENV_SETUP.md)。

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建
pnpm run build

# 代码检查
pnpm run lint
```

## 许可证

MIT
