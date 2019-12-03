
const fs = require('fs');
const marked = require('marked');
const fetch = require('node-fetch');


const isMdFormat = (path => {

  if (path.slice(-3) == '.md') {
    return true;
  } else {
    return false;
  }
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
//obtener links de un archivo .md
const searchLinks = (path => {
  return new Promise((resolve, reject) => {
    readMd(path).then(result => {
      let links = [];
      const renderer = new marked.Renderer();
      renderer.link = function (href, title, text) {

        //tomará los links que NO empiecen con mailto: (enlaces de correo electrónico que abren 
        //directamente para crear correo al enlace encontrado)
        if (!href.startsWith("mailto:") && !href.startsWith("#")) {
          links.push({

            href: href, text: text, file: path
          })
          /*
          href: link encontrado
          text: texto que acompaña la url
          path: ruta del archivo que contiene el link encontrado
          */
        }
      }
      marked(result, { renderer: renderer });

      if (links.length === 0) {
        reject(new Error("Este archivo no contiene links"))
      }
      resolve(links)
      //console.log(links)
    })
      .catch(err => {
        //no se ha encontrad  o ningún enlace
        reject(err)
      })
  })
})


const findMdFilesAndLinks = (path => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, 'utf8', (err, files) => {
      let mdFiles = [];
      files.forEach(element => {
        if (isMdFormat(element)) {
          mdFiles.push(element);
        }
      })
      resolve(mdFiles)
    })
  }).then(mdFiles => {
    //console.log(mdFiles)
    return new Promise((resolve, reject) => {
      let counter = 0;
      let allLinks = [];
      mdFiles.forEach(element => {
        //console.log(element);
        searchLinks(path + '/' + element).then(oneLink => {
          counter++;
          allLinks = allLinks.concat(oneLink)
          if (counter == mdFiles.length) {
            resolve(allLinks)
           // console.log(allLinks)
          }
        })
      })
    })
  })
})
const isFileOrIsFolder = (path => {
  fs.lstat(path, (err, stats) => {
    if (isMdFormat(path)) {
      return searchLinks(path);
    } else {
      return new Promise((resolve, reject) => {
        findMdFilesAndLinks(path).then(links => {          
            resolve({links:links})
            //console.log("estos son los links: ",links)
          
        }).catch(err=>{
          reject(new Error(err.code))
        })

      })
    }
  })
})

// [option --validate]
const validateLinks = (path => {
  return new Promise((resolve, reject) => {
    isFileOrIsFolder(path)
    .then(links => { 
      let fetchLinks = links.map(element => {  
        return fetch(element.href)
        .then(res => {
          if (res.status > 299) {
            element.statusCode = res.status;
            element.status = "FAIL";
          } else {
            element.statusCode = res.status;
            element.status = "OK";
          }
        })
        .catch((err) => {
          element.status = err.code
        }) 
    })
      Promise.all(fetchLinks).then(res => {
          resolve(links)
      })
    })
    .catch(err=>{
      reject(err)
    })
  })
})


function mdLinks(path, options) {


}


module.exports = {
  isFileOrIsFolder,
  validateLinks,
  readMd,
  findMdFilesAndLinks

}