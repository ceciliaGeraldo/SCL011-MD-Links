const fs = require('fs');
const path = require('path');
const marked = require('marked');
const fetch = require('node-fetch');

const isFileOrIsFolder = (path =>{
  return new Promise((resolve,reject) => {
    fs.lstat(path, (err, stats)=> {
      if(err){
          reject(new Error("El archivo o carpeta indicado no existe"))
      }else if(stats.isFile()===true){
        console.log("Es un archivo")
      }else if(stats.isDirectory()===true){
        console.log("Es una carpeta")
      }
      resolve(stats);
    })
  })

 
})

//función leer archivo .md
const readMd = (path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error("¡Ouch! No hemos encontrado el archivo " + path))
      }
      resolve(data)
      //console.log(data)
    })

  })
})

//absorber ruta ingresada por el usuario en consola
let routeFile = process.argv[2];
 // convierte en ruta absoluta la ruta ingresada (path.resolve)
routeFile = path.resolve(routeFile);
 //si existen errores de escritura, lo normaliza para leerlo con éxito (path.normalize)
routeFile = path.normalize(routeFile);

//obtener links de un archivo .md
const searchLinks = (path => {
  return new Promise((resolve, reject) => {
    readMd(path).then(result => {
      let links = [];
      const renderer = new marked.Renderer();
      renderer.link = function(href,title,text){

        //tomará los links que NO empiecen con mailto: (enlaces de correo electrónico que abren 
        //directamente para crear correo al enlace encontrado)
        if(!href.startsWith("mailto:")){
          links.push({

            href:href, text:text, file:path
          })
            /*
            href: link encontrado
            text: texto que acompaña la url
            path: ruta del archivo que contiene el link encontrado
            */ 
        }
      } 
        marked(result,{renderer:renderer}); 
        
        if(links.length===0){
          reject(new Error("Este archivo no contiene links"))
        }
        resolve(links)
        console.log(links)
    })
    .catch(err => {
      //no se ha encontrad  o ningún enlace
      reject(err)
      })
  })
})

isFileOrIsFolder(routeFile);

/*
if(require.main===module){
  readMd(process.argv[2].then(console.log))
}else{
  module.exports=readMd;
}

*/