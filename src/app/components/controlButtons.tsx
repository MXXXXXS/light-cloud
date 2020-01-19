import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";

export default function ControlButtons({
  setFileList,
  setSendAll
}: {
  setFileList: (_: (_: File[]) => File[]) => void;
  setSendAll: (_: boolean) => void;
}) {
  const inputRef = useRef(null);
  return (
    <div className="container">
      <input
        ref={inputRef}
        type="file"
        multiple={true}
        onChange={e => {
          const fileList = e.currentTarget.files;
          if (fileList.length === 0) {
            return;
          }
          setFileList(preFileList => {
            //因为是用文件名作key的, 所以避免key重复就筛选掉了同名文件
            const filesBuffer = [...preFileList];
            const names = {};
            preFileList.forEach(file => {
              names[file.name] = true;
            });
            const files = Array.from(fileList);
            files.forEach(file => {
              if (!names[file.name]) {
                filesBuffer.push(file);
              }
            });
            return filesBuffer;
          });
        }}
      />
      <Button
        className={"icofont-plus"}
        onClick={() => {
          inputRef.current.click();
        }}
      ></Button>
      <Button
        className={"icofont-arrow-right"}
        onClick={() => {
          setSendAll(true);
        }}
      ></Button>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
        }

        input {
          display: none;
        }
      `}</style>
    </div>
  );
}
