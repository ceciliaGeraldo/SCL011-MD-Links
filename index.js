const fs = require('fs');
const path = require('path');

//leer archivo.md
const readMd = (path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error("¡Ouch! No se ha encontrado el archivo " + path))
      }
      resolve(data)
      console.log(data)
    })

  })
})

//ruta ingresada por el usuario en consola
let routeFile = process.argv[2];
 // convierte en ruta absoluta la ruta ingresada (path.resolve)
routeFile = path.resolve(routeFile);
 //si existen errores de escritura, lo normaliza para leerlo con éxito (path.normalize)
routeFile = path.normalize(routeFile);

readMd(routeFile);

/*
if(require.main===module){
  readMd(process.argv[2].then(console.log))
}else{
  module.exports=readMd;
}

*/