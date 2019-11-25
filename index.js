const fs = require('fs');

//leer archivo.md
const readMd = (path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error("¡Ouch! No se ha encontrado el archivo " + path))
      }
      resolve(data)
      //console.log(data)
    })

  })
})
