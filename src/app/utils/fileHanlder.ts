function cleaver(file: File, size: number = 20000) {
  const fileParts: File[] = []
  for (let i = 0; i < file.size; i += size) {
    fileParts.push(new File(
      [file.slice(i, i + size)],
      `${file.name}_${i}`,
      {
        type: file.type
      }))
  }

  return fileParts
}

function fetchFiles(fileParts: File[], url: URL) {
  return fileParts.map((filePart, index) => {
    return fetch(url.toJSON(), {
      method: "POST",
      mode: 'cors',
      body: filePart
    })
  })
}