import React, { useState, useEffect, useRef, useCallback } from "react";
import StatefulButton from "./statefulButton";
import TransmissionState from "../share/buttonStates";
import humanizeDuration from "humanize-duration";

export default function FileLists({
  fileList,
  sendAll = false,
  setSendAll
}: {
  fileList: File[];
  sendAll: boolean;
  setSendAll: (_: boolean) => void;
}) {
  if (sendAll) {
    setSendAll(false);
  }
  return (
    <div>
      {fileList.map(file => (
        <Tile file={file} key={file.name} send={sendAll}></Tile>
      ))}
      <style jsx>{`
        div {
          /* height: 100%; */
          flex: 1;
          overflow-y: auto;
          margin: 0 10px;
        }
      `}</style>
    </div>
  );
}

function ProgressBar({
  progress,
  timeLeft
}: {
  progress: number;
  timeLeft: number;
}) {
  return (
    <div className="container">
      <div className="progress"></div>
      <div className="time">
        {Math.round(progress)}% 剩余:{" "}
        {humanizeDuration(timeLeft, {
          language: "zh_CN",
          round: true
        })}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          flex-basis: calc(100% - 100px);
        /* 这是解决flex在文本溢出时, white-space: nowrap撑大container的问题 */
          min-width: 0;
        }
        .progress {
          height: 4px;
          background-image: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.5),
            skyblue ${progress}%,
            transparent ${progress}%,
            transparent
          );
        }
        .time {
          font-size: 0.8rem;
          color: rgb(200, 200, 200);
          overflow: hidden;
          height: 15px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

function Tile({ file, send = false }: { file: File; send: boolean }) {
  const url = "http://localhost/upload";
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [uploadingState, setUploadingState] = useState(
    TransmissionState.Initial
  );
  const [timeLeft, setTimeLeft] = useState();
  useEffect(() => {
    //"send": 全部启动信号, "uploadingState": 本组件自有控制逻辑
    const sendControl =
      uploadingState === "ready" || (uploadingState === "initial" && send);
    if (sendControl) {
      const startTime = Date.now();
      //为了获取上传进度而使用xhr, 因为fetch目前无法获取上传进度
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url + `?name=${file.name}`, true);
      xhr.onreadystatechange = function() {
        switch (xhr.readyState) {
          case 4: {
            setUploadingState(TransmissionState.Successed);
            break;
          }
        }
      };
      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          const ratio = e.loaded / e.total;
          const timeElapsed = Date.now() - startTime;
          setUploadingState(TransmissionState.Sending);
          setProgressPercentage(ratio * 100);
          setTimeLeft(timeElapsed / ratio - timeElapsed);
        } else {
          console.log("无法计算长度");
        }
      };
      xhr.send(file);
    }
  }, [uploadingState, send]);

  const clickHanlder = useCallback(() => {
    if (uploadingState === "initial") {
      setUploadingState(TransmissionState.Ready);
    }
  }, [uploadingState]);

  return (
    <div className="tile">
      <div className="name">{file.name}</div>
      <div className="progressBar">
        <ProgressBar
          progress={progressPercentage}
          timeLeft={timeLeft}
        ></ProgressBar>
        <StatefulButton
          state={
            uploadingState !== TransmissionState.Initial
              ? uploadingState
              : TransmissionState.Ready
          }
          clickHanlder={clickHanlder}
        ></StatefulButton>
      </div>
      <style jsx>{`
        .tile {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
        .name {
          height: 20px;
          color: skyblue;

          width: calc(100vw - 200px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .progressBar {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }
      `}</style>
    </div>
  );
}
