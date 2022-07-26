import path from 'path';
import fs from 'fs';
// 复制文件
function copyFile(srcPath, tarPath, cb?: (err: Error) => void) {
  const rs = fs.createReadStream(srcPath);
  rs.on('error', (err) => {
    if (err)
      console.log('read error', srcPath);

    cb && cb(err);
  });

  const ws = fs.createWriteStream(tarPath);
  ws.on('error', (err) => {
    if (err)
      console.log('write error', tarPath);

    cb && cb(err);
  });

  ws.on('close', (ex) => {
    cb && cb(ex);
  });

  rs.pipe(ws);
  console.log('复制文件完成', srcPath);
}

// 复制文件夹所有
function copyDir(srcDir, tarDir) {
  if (fs.existsSync(tarDir)) {
    fs.readdir(srcDir, (err, files) => {
      console.log(err);

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

              copyDir(srcPath, tarPath);
              console.log('复制文件完成', srcPath);
            });
          }
          else {
            copyFile(srcPath, tarPath);
            console.log('复制文件完成', srcPath);
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
      copyDir(srcDir, tarDir);
    });
  }
}
