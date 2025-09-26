import fs from "fs-extra";
import * as path from "path";
import * as yauzl from "yauzl";
import { createAuthenticatedAxios } from "./auth.js";


// 获取前端代码模版定义列表
export async function getFrontendCodeTemplateList(tmpl_type: string) : Promise<string> {
    const axios = createAuthenticatedAxios();
    const response = await axios.get(`https://main.test.nmhuixin.com/api/v1/codetemplate/?tmpl_type=${tmpl_type}`);
    return JSON.stringify(response.data);
}

// 导出前端代码模版渲染后的内容到指定目录
export async function exportFrontendCodeTemplate(
    tmpl_type: string, template_id: string, module_name: string, sort_alias: string, output_dir: string
) : Promise<string> {
    const axios = createAuthenticatedAxios();
    let data = {
        tmpl_type,
        template_id,
        module_name,
        sort_alias,
    }
    
    // 下载zip文件
    const zip_file_response = await axios.post(`https://main.test.nmhuixin.com/api/v1/codetemplateexport/`, data, {
        responseType: 'arraybuffer' // 重要：确保以二进制格式接收数据
    });
    
    // 确保输出目录存在
    await fs.ensureDir(output_dir);
    
    // 创建临时zip文件
    const tempZipPath = path.join(output_dir, 'temp.zip');
    await fs.writeFile(tempZipPath, zip_file_response.data);
    
    // 解压zip文件
    const extractedFiles: string[] = [];
    
    return new Promise((resolve, reject) => {
        yauzl.open(tempZipPath, { lazyEntries: true }, (err, zipfile) => {
            if (err) {
                reject(err);
                return;
            }
            if (!zipfile) {
                reject(new Error('无法打开zip文件'));
                return;
            }
            zipfile.readEntry();
            zipfile.on('entry', (entry) => {
                // 跳过目录条目
                if (/\/$/.test(entry.fileName)) {
                    zipfile.readEntry();
                    return;
                }
                zipfile.openReadStream(entry, (err, readStream) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!readStream) {
                        zipfile.readEntry();
                        return;
                    }
                    // 构建目标文件路径
                    const targetPath = path.join(output_dir, entry.fileName);
                    // 确保目标目录存在
                    fs.ensureDirSync(path.dirname(targetPath));
                    // 写入文件
                    const writeStream = fs.createWriteStream(targetPath);
                    readStream.pipe(writeStream);
                    writeStream.on('close', () => {
                        extractedFiles.push(targetPath);
                        zipfile.readEntry();
                    });
                    writeStream.on('error', reject);
                });
            });
            zipfile.on('end', async () => {
                // 清理临时zip文件
                await fs.remove(tempZipPath);
                resolve(JSON.stringify({
                    output_files: extractedFiles,
                }));
            });
            zipfile.on('error', reject);
        });
    });
}
