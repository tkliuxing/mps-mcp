import axios from "axios";

// Token 存储
let authToken: string | null = null;
let tokenExpiry: number | null = null;

// 身份验证配置
const AUTH_CONFIG = {
  baseUrl: "https://main.test.nmhuixin.com/api/v1/auth/",
  tokenRefreshThreshold: 5 * 60 * 1000, // 5分钟前刷新token
};

// 身份验证响应接口
interface AuthResponse {
  token: string;
  expires_in?: number;
  refresh_token?: string;
}

// 身份验证错误类
export class AuthError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * 使用用户名和密码进行身份验证
 */
export async function authenticate(username: string, password: string): Promise<string> {
  try {
    const response = await axios.post<AuthResponse>(AUTH_CONFIG.baseUrl, {
      username,
      password,
      sys_id: 0,
    }, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.data.token) {
      throw new AuthError("服务器响应中缺少token", response.status);
    }

    // 存储token和过期时间
    authToken = response.data.token;
    tokenExpiry = response.data.expires_in 
      ? Date.now() + (response.data.expires_in * 1000)
      : Date.now() + (24 * 60 * 60 * 1000); // 默认24小时
    return authToken;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message || error.message;
      throw new AuthError(`身份验证失败: ${message}`, statusCode);
    }
    throw new AuthError(`身份验证失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 获取当前有效的token
 */
export function getToken(): string | null {
  if (!authToken) {
    return null;
  }

  // 检查token是否过期
  if (tokenExpiry && Date.now() >= tokenExpiry) {
    authToken = null;
    tokenExpiry = null;
    return null;
  }

  return authToken;
}

/**
 * 检查token是否需要刷新
 */
export function shouldRefreshToken(): boolean {
  if (!tokenExpiry) {
    return true;
  }
  
  return Date.now() >= (tokenExpiry - AUTH_CONFIG.tokenRefreshThreshold);
}

/**
 * 清除token
 */
export function clearToken(): void {
  authToken = null;
  tokenExpiry = null;
}

/**
 * 获取带认证头的axios配置
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) {
    throw new AuthError("未找到有效的认证token，请重新登录");
  }
  
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * 创建带认证的axios实例
 */
export function createAuthenticatedAxios() {
  const token = getToken();
  if (!token) {
    throw new AuthError("未找到有效的认证token，请重新登录");
  }

  return axios.create({
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });
}

/**
 * 从环境变量读取认证信息并登录
 */
export async function authenticateFromEnv(): Promise<string> {
  const username = process.env.MPS_USERNAME;
  const password = process.env.MPS_PASSWORD;

  if (!username || !password) {
    throw new AuthError(
      "缺少必要的环境变量: MPS_USERNAME 和 MPS_PASSWORD 必须设置"
    );
  }

  return await authenticate(username, password);
}
