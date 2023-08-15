let htmlTags = ["html","body","header","main","footer","a","p","i","b","h1","h2","h3","h4","h5","h6","section","article","picture","ul","li","div","input","img","nav"];
var socket
function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

socket = io();
// Swal.fire({
//     title: 'Introduce tu nombre',
//     input: 'text',
//     inputAttributes: {
//         autocapitalize: 'off'
//     },
//     inputValidator: (value) => {
//         if (value.length < 3) {
//             return 'El nombre debe tener al menos 3 letras';
//         }
//     },
//     confirmButtonText: 'Entrar',
//     showCancelButton: true,
//     cancelButtonText: 'Solo ver',
//     showLoaderOnConfirm: true,
//     preConfirm: (name) => {
//         sessionStorage.setItem("user",name);
//     },
//     // allowOutsideClick: false
// }).then((result) => {
//     if (result.isConfirmed) {
//         socket.emit("new-connected", sessionStorage.getItem("user"));
//     } else {
//         socket.emit("new-spect");
//     }
// })

window.addEventListener("load", () => {
    let editors = document.getElementsByClassName("editor");
    let htmlEditor = document.getElementById("html-editor");
    let cssEditor = document.getElementById("css-editor");
    let jsEditor = document.getElementById("js-editor");
    let runJs = document.getElementById("run-js");
    let scriptEditor = document.getElementById("script-editor");
    let linkEditor = document.getElementById("link-editor");
    let editorContainer = document.querySelector('section.editor-container');
    let resultsIframe = document.getElementById("results");

    // editorContainer.style.display = 'none';
    // resultsIframe.style.display = 'none';

    let main = document.getElementById("main");
    let div = document.createElement("div");
    // div.inner

    let tags = {
        headOpener: "<head>",
        link: "",
        script: "",
        headCloser: "</head>",
        bodyOpener: "<body>",
        mainOpener: "<main>",
        html: "",
        mainCloser: "</main>",
        styleOpener: "<style>",
        css: "",
        styleCloser: "</style>",
        scriptOpener: "<script>",
        js: "",
        scriptCloser: "</script>",
        bodyCloser: "</body>"
    }

    function load() {
        let sessionHtml = JSON.parse(sessionStorage.getItem('html')) ? JSON.parse(sessionStorage.getItem('html')) : tags;

        let nameTags = Object.keys(tags);
        // console.log("sessionHtml", sessionHtml);
        // console.log(nameTags);
        tags = sessionHtml;

        // tags[type] = value;
        // console.log("tags",tags);
        sessionStorage.setItem("html", JSON.stringify(tags));
        // console.log(type);
        Object.values(tags).forEach((tag,i) => {
            // if (tag == "script" && type=="js") {
            //     scriptEditor.value = tag;
            // }
            //console.log(nameTags[i]);
            // console.log(tags);
            // console.log("asd", tag, nameTags[i]);
            // console.log(`Dentro de ${nameTags[i]} hay ${tag}, pero.... ${tags[nameTags[i]]}`);
            switch (nameTags[i]){
                case "css":
                    cssNewEditor.setValue(tags[nameTags[i]]);
                    break;
                case "link":
                    linkNewEditor.setValue(tags[nameTags[i]]);
                    break;
                case "script":
                    scriptNewEditor.setValue(tags[nameTags[i]]);
                    break;
                case "html":
                    htmlNewEditor.setValue(tags[nameTags[i]]);
                    break;
                case "js":
                    jsNewEditor.setValue(tags[nameTags[i]]);
                    break;
            }
        });
        
        // let newHtml = "";
        // Object.values(tags).forEach((tag,i) => {
        //     if (tag != undefined) {
        //         newHtml += tag;
        //     }
        // });
        // let images = sessionStorage.getItem("images") ? JSON.parse(sessionStorage.getItem("images")) : [];
        // images.forEach(file =>{
        //     //console.log(file.completePath);
        //     newHtml = newHtml.replace(`"${file.relativePath}"`, `"${file.completePath}"`);
        //     //console.log(text);
        // })
        // resultsIframe.srcdoc = newHtml;
        //console.clear();
    }
    function render(type, value) {
        let sessionHtml = JSON.parse(sessionStorage.getItem('html')) ? JSON.parse(sessionStorage.getItem('html')) : tags;

        let nameTags = Object.keys(tags);
        tags = sessionHtml;
        tags[type] = value;
        sessionStorage.setItem("html", JSON.stringify(tags));

        let newHtml = "";

        Object.values(tags).forEach((tag,i) => {
            if (tag != undefined) {
                newHtml += tag;
            }
        });
        switch (type){
            case "css":
                tags.css = cssNewEditor.getValue()
                break;
            case "link":
                // console.log("link");
                tags.link = linkNewEditor.getValue()
                break;
            case "script":
                // console.log("script");
                tags.script = scriptNewEditor.getValue()
                break;
            case "html":
                tags.html = htmlNewEditor.getValue()
                break;
            case "js":
                tags.js = jsNewEditor.getValue();
                validarCodigo(jsNewEditor.getValue())
                break;
        }
        let images = sessionStorage.getItem("images") ? JSON.parse(sessionStorage.getItem("images")) : [];
        images.forEach(file =>{
            //console.log(file.completePath);
            newHtml = newHtml.replace(`"${file.relativePath}"`, `"${file.completePath}"`);
            //console.log(text);
        })
        // console.log(newHtml);
        resultsIframe.srcdoc = newHtml;
        //console.clear();
    }
    load()
    render();

    

    cssEditor.addEventListener("keyup", (e) => {
        render("css", cssNewEditor.getValue());
    })
    linkEditor.addEventListener("keyup", (e) => {
        render("link", linkNewEditor.getValue());
    })
    scriptEditor.addEventListener("keyup", (e) => {
        render("script", scriptNewEditor.getValue());
    })
    htmlEditor.addEventListener("keyup", (e) => {
        render("html", htmlNewEditor.getValue());
    })
    runJs.addEventListener("click", (e) => {
        let selection = jsEditor.selectionStart;
        render("js", jsNewEditor.getValue());
        jsEditor.selectionStart = jsEditor.selectionEnd = selection;
    })
    const fileInput = document.getElementById('folder');
    let text = '<body><img src="" alt=""><img src="/img/adc.png" alt=""></body>'

    function validarCodigo(codigo) {
        var opciones = {
            node: true, // Para leer las variables globales
            latedef: true, // Si una variable se llama antes de ser definida, salta error
            undef: true, // Si una variable indefinida se llama, salta error
            esversion: 6, // Para poder leer los let
            // predef: { // Las variables definidas aquí, se asume que existen previamente
            //   miVariable: true
            // }
        };
        
    
        var resultado = JSHINT(codigo, opciones);
        
        if (resultado) {
            // console.log("miVariable",miVariable);
            // console.log("El código es válido");
        } else {
            // console.log("El código es inválido");
            // console.log(JSHINT.errors);
        }
    }
    
    // validarCodigo("console.log(miVariable);");

    fileInput.addEventListener("change", (e) => {
        let selectedFiles = [...fileInput.files];
        if (selectedFiles.length == 0) {
            throw new Error("Se ha subido una carpeta vacía")
        } else if (selectedFiles[0].webkitRelativePath.split('/')[0] != "public") {
            throw new Error("La carpeta base que se ha subido no se llama public")
        } else {
            selectedFiles = selectedFiles.map(file =>{
                let item = {
                    name: file.name,
                    relativePath: file.webkitRelativePath.replace("public", ""),
                    completePath: URL.createObjectURL(file),
                }
                return item
            })
            sessionStorage.setItem("images", JSON.stringify(selectedFiles));
            selectedFiles.forEach(file =>{
                //console.log(file.completePath);
                text = text.replace(`"${file.relativePath}"`, `"${file.completePath}"`);
                //console.log(text);
            })
            let fileLabel = document.querySelector("label[for='folder'");
            fileLabel.innerHTML = '<i class="fas fa-redo"></i> Carpeta public cargada'
            //console.log(selectedFiles);
            //document.getElementById("results").srcdoc = text;
        }
        render();
    });

    
})