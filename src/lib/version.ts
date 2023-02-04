import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import pacote from 'pacote';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// 获取当前包的信息
export const getPkgInfo = () => {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const jsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
  const jsonResult = JSON.parse(jsonContent);

  return jsonResult as { name: string; version: string };
};

// 获取最新包最新版本
export const getLatestVersion = async (pkgName: string) => {
  const manifest = await pacote.manifest(`${pkgName}@latest`);
  return manifest.version;
};
