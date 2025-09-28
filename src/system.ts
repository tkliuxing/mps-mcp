import { createAuthenticatedAxios } from "./auth.js";

// 获取MPS平台系统列表
export async function getSystemList() : Promise<string> {
    const axios = createAuthenticatedAxios();
    const response = await axios.get("https://main.test.nmhuixin.com/api/v1/system/");
    let resp = response.data;
    let sys_list = [];
    for (let sys of resp) {
        sys_list.push({
            id: sys.pk,
            name: sys.name,
            description: sys.description,
        });
    }
    return JSON.stringify(sys_list);
}

// 获取指定系统的表单模板定义列表
export async function listSystemFormTemplate(sys_id: number) : Promise<string> {
    const axios = createAuthenticatedAxios();
    const response = await axios.get(`https://main.test.nmhuixin.com/api/v1/formtemplate/?sys_id=${sys_id}`);
    let resp = response.data;
    let form_template_list = [];
    for (let form_template of resp) {
        let fields = [];
        for (let f of form_template.field) {
            fields.push({
                alias: f.alias,
                col_title: f.col_title,
                in_filter: f.in_filter,
                local_data_source: f.local_data_source ? JSON.parse(f.local_data_source) : null,
                widget: f.widget,
                widget_attr: f.widget_attr ? JSON.parse(f.widget_attr) : null,
            });
        }
        form_template_list.push({
            id: form_template.pk,
            title: form_template.title,
            api_name: form_template.api_name,
            keyword: form_template.keyword,
            remark: form_template.remark,
            header_conf: form_template.header_conf,
            fields: fields,
        });
    }
    return JSON.stringify(form_template_list);
}

// 获取指定系统的功能权限树
export async function getSystemPermissionTree(sys_id: number) : Promise<string> {
    const axios = createAuthenticatedAxios();
    const response = await axios.get(`https://main.test.nmhuixin.com/api/v1/permissionstree/?sys_id=${sys_id}&biz_id=1&level=0`);
    return JSON.stringify(response.data);
}

// 获取指定项目的路由树
export async function getSystemProjectRouterTree(project_id: string) : Promise<string> {
    const axios = createAuthenticatedAxios();
    const response = await axios.get(`https://main.test.nmhuixin.com/api/v1/systempr/?is_root=True&project=${project_id}`);
    return JSON.stringify(response.data);
}

// 创建指定项目的路由
export async function createSystemProjectRouter(
    sys_id: number,
    project_id: string,
    parent_id: string | null = null,
    path: string,
    title: string | null,
    name: string,
    component: string | null = null,
    redirect: string | null = null,
    props: boolean,
    meta: string | null = null,
    permission_id: string | null = null) : Promise<string> {
    let data: any = {
        sys_id,
        project: project_id,
        parent_id,
        path,
        title,
        name,
        component,
        props,
        permission: permission_id,
    };
    if(redirect) {
        data.redirect = redirect;
    }
    if(meta) {
        data.meta = meta;
    }
    const axios = createAuthenticatedAxios();
    try{
        const response = await axios.post(`https://main.test.nmhuixin.com/api/v1/systempr/`, data);
        return JSON.stringify(response.data);
    }catch (error: any) {
        let content = JSON.stringify(error.response.data);
        return `创建失败: ${content}`;
    }
}

// 删除指定项目的路由
export async function deleteSystemProjectRouter(router_id: string) : Promise<string> {
    const axios = createAuthenticatedAxios();
    try{
        await axios.delete(`https://main.test.nmhuixin.com/api/v1/systempr/${router_id}/`);
        return "删除成功";
    }
    catch (error) {
        return `删除失败: ${error instanceof Error ? error.message : String(error)}`;
    }
}

// 获取指定项目的菜单树
export async function getSystemProjectMenuTree(project_id: string) : Promise<string> {
    const axios = createAuthenticatedAxios();
    const response = await axios.get(`https://main.test.nmhuixin.com/api/v1/systempm/?project=${project_id}&is_root=True`);
    return JSON.stringify(response.data);
}

// 创建指定项目的菜单
/* 
    sys_id: int = Field(..., description='系统ID')
    project_id: str = Field(..., description='项目ID')
    parent_id: Optional[str] = Field(None, description='父级菜单ID')
    name: str = Field(..., description='菜单名称')
    icon: Optional[str] = Field(None, description='图标')
    router_name: Optional[str] = Field(None, description='路由名称')
    permission_id: Optional[str] = Field(None, description='权限ID')
*/
export async function createSystemProjectMenu(
    sys_id: number,
    project_id: string,
    parent_id: string | null,
    name: string,
    icon: string | null,
    router_name: string | null,
    permission_id: string | null) : Promise<string> {
    let data: any = {
        sys_id,
        project: project_id,
        name,
        icon,
        router_name,
    };
    if(parent_id) {
        data.parent_id = parent_id;
    }
    if(permission_id) {
        data.permission = permission_id;
    }
    const axios = createAuthenticatedAxios();
    const response = await axios.post(`https://main.test.nmhuixin.com/api/v1/systempm/`, data);
    return JSON.stringify(response.data);
}

// 删除指定项目的菜单
export async function deleteSystemProjectMenu(menu_id: string) : Promise<string> {
    const axios = createAuthenticatedAxios();
    try{
        await axios.delete(`https://main.test.nmhuixin.com/api/v1/systempm/${menu_id}/`);
        return "删除成功";
    }
    catch (error) {
        return `删除失败: ${error instanceof Error ? error.message : String(error)}`;
    }
}

