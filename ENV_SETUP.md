# 环境变量配置说明

## 必需的环境变量

在启动MPS MCP服务器之前，需要设置以下环境变量：

### MPS_USERNAME
- **描述**: MPS平台的用户名
- **类型**: 字符串
- **必需**: 是

### MPS_PASSWORD  
- **描述**: MPS平台的密码
- **类型**: 字符串
- **必需**: 是

## 设置方法

### 方法1: 使用 .env 文件
在项目根目录创建 `.env` 文件：

```bash
# .env
MPS_USERNAME=your_username
MPS_PASSWORD=your_password
```

### 方法2: 直接设置环境变量
```bash
export MPS_USERNAME=your_username
export MPS_PASSWORD=your_password
```

### 方法3: 在启动命令中设置
```bash
MPS_USERNAME=your_username MPS_PASSWORD=your_password pnpm start
```

## 安全注意事项

1. **不要将 .env 文件提交到版本控制系统**
2. **使用强密码**
3. **定期更换密码**
4. **在生产环境中使用环境变量管理工具**

## 故障排除

如果遇到认证失败，请检查：

1. 环境变量是否正确设置
2. 用户名和密码是否正确
3. 网络连接是否正常
4. MPS服务器是否可访问
