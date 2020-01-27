import fs from "fs";
import path from "path";

const filePartNamePattern = /(.*)_part\d$/;

export default function collectFileParts(filePath: string) {
  const filePartsDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const files = fs.readdirSync(filePartsDir);
  const matchedFiles = files.filter(name => {
    const result = name.match(filePartNamePattern);
    if (result) {
      const nameWithoutPart = result[1];
      return fileName === nameWithoutPart;
    } else {
      return false;
    }
  });
  if (matchedFiles.length === 1) {
    fs.renameSync(
      path.resolve(filePartsDir, matchedFiles[0]),
      path.resolve(filePartsDir, fileName.match(filePartNamePattern)[1])
    );
  } else if (matchedFiles.length > 1) {
    matchedFiles.sort(); //默认升序
    console.log(matchedFiles);

    const filePartFullPaths = matchedFiles.map(p =>
      path.resolve(filePartsDir, p)
    );

    return concatFileParts(
      filePartFullPaths,
      path.resolve(filePartsDir, fileName)
    );
  }
}

async function concatFileParts(partPaths: string[], distFile: string) {
  if (fs.existsSync(distFile)) {
    fs.unlinkSync(distFile);
  }
  try {
    const distFileWriteable = fs.createWriteStream(distFile, {
      encoding: "binary",
      flags: "a" //增量写入
    });
    const partsReadable = partPaths.map(part => {
      return new Promise((res, rej) => {
        const partStream = fs.createReadStream(part, {
          encoding: "binary"
        });

        partStream.on("end", () => {
          partStream.removeAllListeners("end");
          console.log(`已将${path.basename(part)}写入目标文件`);
          res();
        });

        partStream.on("error", err => {
          rej(err);
        });

        partStream.pipe(distFileWriteable, {
          end: false
        });
      });
    });

    for (let i = 0; i < partsReadable.length; i++) {
      await partsReadable[i].catch(err => console.error(err));
    }

    partPaths.forEach(p => {
      fs.unlink(p, err => {
        if (err) {
          console.error(`未能删除文件片段: ${path.basename(p)}, error: ${err}`);
        } else {
        }
      });
    });
  } catch (err) {
    console.error(err);
    return err;
  }
}
