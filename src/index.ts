#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import { z } from "zod";
import { authenticateFromEnv } from "./auth.js";
import {
  getSystemList,
  listSystemFormTemplate,
  getSystemPermissionTree,
  getSystemProjectRouterTree,
  createSystemProjectRouter,
  deleteSystemProjectRouter,
  getSystemProjectMenuTree,
  createSystemProjectMenu,
  deleteSystemProjectMenu,
} from "./system.js";
import {
  getFrontendCodeTemplateList,
  exportFrontendCodeTemplate,
} from "./code_templates.js";

const server = new FastMCP({
  name: "MPS Platform MCP Server",
  version: "1.0.0",
});

// 获取MPS平台系统列表
server.addTool({
  name: "getSystemList",
  description: "获取MPS平台系统列表",
  execute: async () => {
    return await getSystemList();
  },
});

// 获取指定系统的表单模板定义列表
server.addTool({
  name: "listSystemFormTemplate",
  description: "获取指定系统的表单模板定义列表",
  parameters: z.object({sys_id: z.number().describe("系统ID（sys_id）")}),
  execute: async (args) => {
    return await listSystemFormTemplate(args.sys_id);
  },
});

// 获取指定系统的功能权限树
server.addTool({
  name: "getSystemPermissionTree",
  description: "获取指定系统的功能权限树",
  parameters: z.object({sys_id: z.number().describe("系统ID（sys_id）")}),
  execute: async (args) => {
    return await getSystemPermissionTree(args.sys_id);
  },
});

// 获取指定项目的路由树
server.addTool({
  name: "getSystemProjectRouterTree",
  description: "获取指定项目的路由树",
  parameters: z.object({project_id: z.string().describe("项目ID（project_id）")}),
  execute: async (args) => {
    return await getSystemProjectRouterTree(args.project_id);
  },
});

// 创建指定项目的路由
server.addTool({
  name: "createSystemProjectRouter",
  description: "创建指定项目的路由",
  parameters: z.object({
    sys_id: z.number().describe("系统ID（sys_id）"),
    project_id: z.string().describe("项目ID（project_id）"),
    parent_id: z.nullable(z.string()).default(null).describe("父级路由ID（parent_id）"),
    path: z.string().describe("路由路径（path）"),
    title: z.string().describe("路由页面标题（title）"),
    name: z.string().describe("路由名称（name）"),
    component: z.string().describe("路由组件（component）"),
    redirect: z.nullable(z.string()).default(null).describe("路由重定向（redirect）"),
    props: z.boolean().default(false).describe("路由传参（props）"),
    meta: z.nullable(z.string()).default(null).describe("路由元信息（给vue-router用的meta信息，JSON字符串）"),
    permission_id: z.nullable(z.string()).default(null).describe("权限ID（permission_id）")
  }),
  execute: async (args) => {
    return await createSystemProjectRouter(
      args.sys_id,
      args.project_id,
      args.parent_id,
      args.path,
      args.title,
      args.name,
      args.component,
      args.redirect,
      args.props,
      args.meta,
      args.permission_id);
  },
});

// 删除指定项目的路由
server.addTool({
  name: "deleteSystemProjectRouter",
  description: "删除指定项目的路由",
  parameters: z.object({router_id: z.string().describe("路由ID（router_id）")}),
  execute: async (args) => {
    return await deleteSystemProjectRouter(args.router_id);
  },
});

// 获取指定项目的菜单树
server.addTool({
  name: "getSystemProjectMenuTree",
  description: "获取指定项目的菜单树",
  parameters: z.object({project_id: z.string().describe("项目ID（project_id）")}),
  execute: async (args) => {
    return await getSystemProjectMenuTree(args.project_id);
  },
});

// 创建指定项目的菜单
server.addTool({
  name: "createSystemProjectMenu",
  description: "创建指定项目的菜单",
  parameters: z.object({
    sys_id: z.number().describe("系统ID（sys_id）"),
    project_id: z.string().describe("项目ID（project_id）"),
    parent_id: z.nullable(z.string()).default(null).describe("父级菜单ID（parent_id）"),
    name: z.string().describe("菜单名称（name）"),
    icon: z.nullable(z.string()).default(null).describe("图标（icon）"),
    router_name: z.string().describe("路由名称（router_name）"),
    permission_id: z.nullable(z.string()).default(null).describe("权限ID（permission_id）")
  }),
  execute: async (args) => {
    return await createSystemProjectMenu(
      args.sys_id,
      args.project_id,
      args.parent_id,
      args.name,
      args.icon,
      args.router_name,
      args.permission_id,
    );
  },
});

// 删除指定项目的菜单
server.addTool({
  name: "deleteSystemProjectMenu",
  description: "删除指定项目的菜单",
  parameters: z.object({menu_id: z.string().describe("菜单ID（menu_id）")}),
  execute: async (args) => {
    return await deleteSystemProjectMenu(args.menu_id);
  },
});

// 获取前端代码模版定义列表
server.addTool({
  name: "getFrontendCodeTemplateList",
  description: "获取前端代码模版定义列表",
  parameters: z.object({tmpl_type: z.literal(["vue", "uni-app"]).describe("模版类型（tmpl_type）")}),
  execute: async (args) => {
    return await getFrontendCodeTemplateList(args.tmpl_type);
  },
});

// 导出前端代码模版渲染后的内容到指定目录
server.addTool({
  name: "exportFrontendCodeTemplate",
  description: "导出前端代码模版渲染后的内容到指定目录",
  parameters: z.object({
    tmpl_type: z.literal(["vue", "uni-app"]).describe("模版类型（tmpl_type）"),
    template_id: z.string().describe("模版ID（template_id）"),
    module_name: z.string().describe("模块名称（module_name）"),
    sort_alias: z.string().describe("排序别名（sort_alias）"),
    output_dir: z.string().describe("输出目录（output_dir）")
  }),
  execute: async (args) => {
    return await exportFrontendCodeTemplate(
      args.tmpl_type,
      args.template_id,
      args.module_name,
      args.sort_alias,
      args.output_dir,
    );
  },
});

// 启动函数
async function startServer() {
  try {
    const token = await authenticateFromEnv();
    // 启动MCP服务器
    server.start({
      transportType: "stdio",
    });
  } catch (error) {
    console.error("启动服务器失败:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// 启动服务器
startServer();