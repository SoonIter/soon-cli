import path from 'path';
import fs, { existsSync } from 'fs-extra';
import replaceStream from 'replacestream';

async function replaceFileText(
  srcPath,
  tarPath,
  options = { matchText: '[name]', replaceText: '[name]' },
) {
  const { matchText, replaceText } = options;
  const rs = fs.createReadStream(srcPath);

  rs.on('error', (err) => {
    if (err)
      console.log('read error', srcPath);
  });

  const ws = fs.createWriteStream(tarPath);
  ws.on('error', (err) => {
    if (err)
      console.log('write error', tarPath);
  });

  rs.pipe(replaceStream(matchText, replaceText)).pipe(ws);
  console.log('复制文件', srcPath);
}

export async function replaceDirText(
  srcDir,
  tarDir,
  options = { matchText: '[name]', replaceText: '[name]' },
) {
  const isExisted = existsSync(tarDir);

  if (isExisted) {
    fs.readdir(srcDir, (err, files) => {
      err && console.log(err);
      files.forEach((file) => {
        const srcPath = path.join(srcDir, file);
        const tarPath = path.join(tarDir, file);

        fs.stat(srcPath, (e, stats) => {
          if (stats.isDirectory()) {
            fs.mkdir(tarPath, (err) => {
              if (err) {
                console.log(err);
                return;
              }

              replaceDirText(srcPath, tarPath);
            });
          }
          else {
            replaceFileText(srcPath, tarPath, options);
          }
        });
      });
    });
  }
  else {
    fs.mkdir(tarDir, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('创建文件夹', tarDir);
      replaceDirText(srcDir, tarDir, options);
    });
  }
}
