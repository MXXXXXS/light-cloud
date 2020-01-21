function cleaver(file: File, size: number = 5 * 1024 * 1024) {
  if (file.size > size) {
    const fileParts: File[] = [];
    for (let i = 0; i < file.size; i += size) {
      fileParts.push(
        new File([file.slice(i, i + size)], `${file.name}`, {
          type: file.type
        })
      );
    }
    return fileParts;
  } else {
    return [file];
  }
}

export function upLoadFile(
  file: File,
  url: string,
  onFinished?: () => void,
  onProgress?: (_: { ratio: number; timeLeft: number }) => void
) {
  const startTime = Date.now();
  //为了获取上传进度而使用xhr, 因为fetch目前无法获取上传进度
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url + `?name=${file.name}`, true);
  xhr.onreadystatechange = function() {
    switch (xhr.readyState) {
      case 4: {
        onFinished();
        break;
      }
    }
  };
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      const ratio = e.loaded / e.total;
      const timeElapsed = Date.now() - startTime;
      onProgress({
        ratio: ratio * 100,
        timeLeft: timeElapsed / ratio - timeElapsed
      });
    }
  };
  xhr.send(file);
}

export async function upLoadLargeFile(
  file: File,
  url: string,
  onFinished?: () => void,
  onProgress?: (_: { ratio: number; timeLeft: number }) => void
) {
  const fileParts = cleaver(file);
  const ratioUnit = 1 / fileParts.length;
  const startTime = Date.now();
  let ratioAccumulator = 0;
  let remain = fileParts.length;

  fileParts.forEach((file, index) => {
    return fetch(url + `?name=${file.name}&part=${index}`, {
      method: "POST",
      mode: "cors",
      body: file
    }).then(res => {
      if (res.ok) {
        if (--remain === 0) {
          onFinished();
        }
        const ratio = (ratioAccumulator += ratioUnit);
        const timeElapsed = Date.now() - startTime;
        onProgress({
          ratio: ratio * 100,
          timeLeft: timeElapsed / ratio - timeElapsed
        });
      }
    });
  });
}
