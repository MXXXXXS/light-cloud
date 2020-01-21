import fs from "fs";
import path from "path";

export default function collectFileParts(filePath: string) {
  const filePartsDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const files = fs.readdirSync(filePartsDir);
  const matchedFiles = files.filter(name => {
    const result = name.match(/(.*)_part\d/);
    if (result) {
      const nameWithoutPart = result[1];
      return fileName === nameWithoutPart;
    } else {
      return false;
    }
  });
  matchedFiles.sort(); //默认升序
  console.log(matchedFiles);
  matchedFiles.reduce((acc, cur) => {
    fs.writeFileSync(
      acc,
      fs.readFileSync(path.resolve(filePartsDir, cur), {
        encoding: "binary"
      }),
      {
        flag: "a",
        encoding: "binary"
      }
    );
    return acc;
  }, path.resolve(filePartsDir, fileName));
}
