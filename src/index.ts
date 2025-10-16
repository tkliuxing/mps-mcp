#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import { z } from "zod";
import { authenticateFromEnv } from "./auth.js";
import {
  getSystemList,
  listSystemFormTemplate,
  getSystemFormTemplate,
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

// 模块开发过程
server.addPrompt({
  name: "module-development",
  description: "MPS前端模块开发过程",
  arguments: [
    {
      name: "sys_id",
      description: "系统ID",
      required: true,
    },
    {
      name: "project_id",
      description: "项目ID",
      required: true,
    },
    {
      name: "module_name",
      description: "模块名称 (中文名) ",
      required: true,
    }
  ],
  load: async (args) => {
    return `
    使用以下步骤完成${args.module_name}模块的开发：
    1. 获取MPS平台系统列表
    2. 获取 sys_id = ${args.sys_id} 系统的功能权限树
    3. 获取指定系统的表单模板定义列表，找到${args.module_name}模块的表单模板定义, 获取到 PK 用于后续生成前端代码
    4. 使用模块名称 (${args.module_name}) 的拼音字母 (驼峰式) 作为模块名，在 src/pages 中创建相应模块的目录 src/pages/${args.module_name}的拼音字母
    4. 使用第3步获取到的 PK 用 exportFrontendCodeTemplate 工具导出前端代码到以上目录 (使用绝对路径) 
    5. 将导出的前端代码的 Index.vue 文件在 src/pageReg.js 中增加引用
    6. 获取 project_id = ${args.project_id} 项目的路由树
    7. 选取合适的路由树节点 (至少在 "/" 下) 作为上级，创建${args.module_name}模块的路由
    8. 获取 project_id = ${args.project_id} 项目的菜单树
    9. 选取合适的菜单树节点作为上级 (可为空) ，创建${args.module_name}模块的菜单
    10. 优化 Table.vue 中各个列的宽度 (根据表头含义推测) 
    11. 优化 Form.vue 表单布局，可根据字段相关性和重要程度分块排版
    12. 完成

    使用以下工具完成：
    - getSystemList
    - getSystemPermissionTree
    - listSystemFormTemplate
    - exportFrontendCodeTemplate
    - getSystemProjectRouterTree
    - createSystemProjectRouter
    - getSystemProjectMenuTree
    - createSystemProjectMenu
    `;
  }
});

// 模块开发过程说明工具
server.addTool({
  name: "module-development-description",
  description: "模块开发过程说明",
  parameters: z.object({
    sys_id: z.number().describe("系统ID (sys_id) "),
    project_id: z.string().describe("项目ID (project_id) "),
    module_name: z.string().describe("模块名称 (module_name) "),
  }),
  execute: async (args) => {
    return `
    使用以下步骤完成${args.module_name}模块的开发：
    1. 获取MPS平台系统列表
    2. 获取 sys_id = ${args.sys_id} 系统的功能权限树
    3. 获取指定系统的表单模板定义列表，找到${args.module_name}模块的表单模板定义, 获取到 PK 用于后续生成前端代码
    4. 使用模块名称 (${args.module_name}) 的拼音字母 (驼峰式) 作为模块名，在 src/pages 中创建相应模块的目录 src/pages/${args.module_name}的拼音字母
    4. 使用第3步获取到的 PK 用 exportFrontendCodeTemplate 工具导出前端代码到以上目录 (使用绝对路径) 
    5. 将导出的前端代码的 Index.vue 文件在 src/pageReg.js 中增加引用
    6. 获取 project_id = ${args.project_id} 项目的路由树
    7. 选取合适的路由树节点PK作为上级 parent (比如使用 path 为 "/" 的路由的 PK 作为 parent)，创建${args.module_name}模块的路由
    8. 获取 project_id = ${args.project_id} 项目的菜单树
    9. 选取合适的菜单树节点作为上级 (可为空) ，创建${args.module_name}模块的菜单
    10. 优化 Table.vue 中各个列的宽度 (根据表头含义推测) 
    11. 优化 Form.vue 表单布局，可根据字段相关性和重要程度分块排版
    12. 完成
    
    使用以下工具完成：
    - getSystemList
    - getSystemPermissionTree
    - listSystemFormTemplate
    - exportFrontendCodeTemplate
    - getSystemProjectRouterTree
    - createSystemProjectRouter
    - getSystemProjectMenuTree
    - createSystemProjectMenu
    `;
  },
})

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
  parameters: z.object({sys_id: z.number().describe("系统ID (sys_id) ")}),
  execute: async (args) => {
    return await listSystemFormTemplate(args.sys_id);
  },
});

// 获取指定template_id的表单定义
server.addTool({
  name: "getSystemFormTemplate",
  description: "获取指定template_id的表单定义",
  parameters: z.object({template_id: z.string().describe("表单模板ID (template_id) ")}),
  execute: async (args) => {
    return await getSystemFormTemplate(args.template_id);
  },
});

// 获取指定系统的功能权限树
server.addTool({
  name: "getSystemPermissionTree",
  description: "获取指定系统的功能权限树",
  parameters: z.object({sys_id: z.number().describe("系统ID (sys_id) ")}),
  execute: async (args) => {
    return await getSystemPermissionTree(args.sys_id);
  },
});

// 获取指定项目的路由树
server.addTool({
  name: "getSystemProjectRouterTree",
  description: "获取指定项目的路由树, 层级关系由parent标识, parent为父级的pk值, 如果parent为空, 则表示根节点",
  parameters: z.object({project_id: z.string().describe("项目ID (project_id) ")}),
  execute: async (args) => {
    return await getSystemProjectRouterTree(args.project_id);
  },
});

// 创建指定项目的路由
server.addTool({
  name: "createSystemProjectRouter",
  description: "创建指定项目的路由, 层级关系由parent标识, parent为父级的pk值, 如果parent为空, 则表示根节点",
  parameters: z.object({
    sys_id: z.number().describe("系统ID (sys_id) "),
    project_id: z.string().describe("项目ID (project_id) "),
    parent: z.nullable(z.string()).default(null).describe("父级路由ID (parent) "),
    path: z.string().describe("路由路径 (path) "),
    title: z.string().describe("路由页面标题 (title) "),
    name: z.string().describe("路由名称 (name) "),
    component: z.string().describe("路由组件 (component) "),
    redirect: z.nullable(z.string()).default(null).describe("路由重定向 (redirect) "),
    props: z.boolean().default(false).describe("路由传参 (props) "),
    meta: z.nullable(z.string()).default(null).describe("路由元信息 (给vue-router用的meta信息，JSON字符串) "),
    permission_id: z.nullable(z.string()).default(null).describe("权限ID (permission_id) ")
  }),
  execute: async (args) => {
    return await createSystemProjectRouter(
      args.sys_id,
      args.project_id,
      args.parent,
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
  parameters: z.object({router_id: z.string().describe("路由ID (router_id) ")}),
  execute: async (args) => {
    return await deleteSystemProjectRouter(args.router_id);
  },
});

// 获取指定项目的菜单树
server.addTool({
  name: "getSystemProjectMenuTree",
  description: "获取指定项目的菜单树, 层级关系由parent标识, parent为父级的pk值, 如果parent为空, 则表示根节点",
  parameters: z.object({project_id: z.string().describe("项目ID (project_id) ")}),
  execute: async (args) => {
    return await getSystemProjectMenuTree(args.project_id);
  },
});

// 创建指定项目的菜单
server.addTool({
  name: "createSystemProjectMenu",
  description: "创建指定项目的菜单, 层级关系由parent标识, parent为父级的pk值, 如果parent为空, 则表示根节点",
  parameters: z.object({
    sys_id: z.number().describe("系统ID (sys_id) "),
    project_id: z.string().describe("项目ID (project_id) "),
    parent: z.nullable(z.string()).default(null).describe("父级菜单ID (parent) "),
    name: z.string().describe("菜单名称 (name) "),
    icon: z.nullable(z.string()).default(null).describe("图标 (icon) "),
    router_name: z.string().describe("路由名称 (router_name) "),
    permission_id: z.nullable(z.string()).default(null).describe("权限ID (permission_id) ")
  }),
  execute: async (args) => {
    return await createSystemProjectMenu(
      args.sys_id,
      args.project_id,
      args.parent,
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
  parameters: z.object({menu_id: z.string().describe("菜单ID (menu_id) ")}),
  execute: async (args) => {
    return await deleteSystemProjectMenu(args.menu_id);
  },
});

// 获取前端代码模版定义列表
server.addTool({
  name: "getFrontendCodeTemplateList",
  description: "获取前端代码模版定义列表(已废弃)",
  parameters: z.object({tmpl_type: z.literal(["vue", "uni-app"]).describe("模版类型 (tmpl_type) ")}),
  execute: async (args) => {
    return await getFrontendCodeTemplateList(args.tmpl_type);
  },
});

// 导出前端代码模版渲染后的内容到指定目录
server.addTool({
  name: "exportFrontendCodeTemplate",
  description: "导出前端代码模版渲染后的内容到指定目录",
  parameters: z.object({
    tmpl_type: z.literal(["vue", "uni-app"]).describe("模版类型 (tmpl_type) "),
    template_id: z.string().describe("模版ID (template_id) "),
    module_name: z.string().describe("模块名称 (module_name) "),
    sort_alias: z.string().describe("排序别名 (sort_alias) "),
    output_dir: z.string().describe("输出目录 (output_dir) ")
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