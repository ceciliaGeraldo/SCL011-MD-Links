const mdLinks = require('./lib/mdLinks.js');
const pathJS = require('path')


  //absorber ruta ingresada por el usuario en consola
  let routeFile = process.argv[2];
  // convierte en ruta absoluta la ruta ingresada (path.resolve)
  routeFile = pathJS.resolve(routeFile);
  //si existen errores de escritura, lo normaliza para leerlo con éxito (path.normalize)
  routeFile = pathJS.normalize(routeFile);

//mdLinks.isFileOrIsFolder(routeFile)
//mdLinks.findMdFiles(routeFile)
mdLinks.validateLinks(routeFile)
//mdLinks.readMd(routeFile)

/*
if(require.main===module){
  readMd(process.argv[2].then(console.log))
}else{
  module.exports=readMd;
}

*/
