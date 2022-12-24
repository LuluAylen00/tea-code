let htmlTags = ["html","body","header","main","footer","a","p","i","b","h1","h2","h3","h4","h5","h6","section","article","picture","ul","li","div","input","img","nav"];

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

window.addEventListener("load", () => {
    let editors = document.getElementsByClassName("editor");
    let htmlEditor = document.getElementById("html-editor");
    let cssEditor = document.getElementById("css-editor");
    let jsEditor = document.getElementById("js-editor");
    let scriptEditor = document.getElementById("script-editor");
    let linkEditor = document.getElementById("link-editor");
    let resultsIframe = document.getElementById("results");

    for (let i = 0; i < editors.length; i++) {
        const editor = editors[i];
        editor.addEventListener('keydown', function(e) {
            //console.log(e.key);
            let start = this.selectionStart;
            let end = this.selectionEnd;
            if (e.key == 'Tab') {
                e.preventDefault();
                this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 1;
            } else if (e.key == 'Enter'){
                e.preventDefault();
                let start = this.selectionStart;
                let end = this.selectionEnd;
                let initialText = this.value.substring(0, start);
                let finalText = this.value.substring(end);
                
                let tabIndex = 0
                tabIndex = tabIndex + getIndicesOf("<", initialText).length - (getIndicesOf("</", initialText).length * 2) - getIndicesOf("/>", initialText).length; // -1
                //console.log(tabIndex);
                let tab = "";
                for (let i = 0; i < tabIndex; i++) {
                    tab += "\t"
                }
                let detecting = initialText.lastIndexOf("/") >= initialText.lastIndexOf("<") ? "" : "\n"
                this.value = initialText + "\n" + tab + detecting + finalText;

                this.selectionStart = this.selectionEnd = start + 1 + (tabIndex != -1 ? tabIndex : 1) ;
                
            } else if (e.key == ">") {
                let initialText = this.value.substring(0, start);
                
                htmlTags.forEach(t => {
                    if (initialText.lastIndexOf(`<${t} `) > initialText.lastIndexOf(">") || initialText.split("<")[initialText.split("<").length-1] == t) {
                        e.preventDefault();
                        let detecting = `></${t}>`;
                        this.value = initialText + detecting + this.value.substring(end);
                        this.selectionStart = this.selectionEnd = start + 1;
                    }
                })
            } else if (e.key == "=") {
                let initialText = this.value.substring(0, start);

                if (initialText.lastIndexOf(`<`) > initialText.lastIndexOf(">")) {
                    e.preventDefault();
                    let detecting = `=""`;
                    this.value = initialText + detecting + this.value.substring(end);
                    this.selectionStart = this.selectionEnd = start + 2;
                }
            }
        });        
    }
    let tags = {
        headOpener: "<head>",
        link: "",
        styleOpener: "<style>",
        css: "",
        styleCloser: "</style>",
        script: "",
        headCloser: "</head>",
        bodyOpener: "<body>",
        mainOpener: "<main>",
        html: "",
        mainCloser: "</main>",
        scriptOpener: "<script>",
        js: "",
        scriptCloser: "</script>",
        bodyCloser: "</body>"
    }

    function render(type, value) {
        let sessionHtml = JSON.parse(sessionStorage.getItem('html')) ? JSON.parse(sessionStorage.getItem('html')) : tags;

        let nameTags = Object.keys(tags);
        // console.log("sessionHtml", sessionHtml);
        // console.log(nameTags);
        tags = sessionHtml;

        tags[type] = value;
        // console.log("tags",tags);
        sessionStorage.setItem("html", JSON.stringify(tags));

        Object.values(tags).forEach((tag,i) => {
            //console.log(nameTags[i]);
            switch (nameTags[i]){
                case "css":
                    cssEditor.value = tag;
                    break;
                case "link":
                    linkEditor.value = tag;
                    break;
                case "script":
                    scriptEditor.value = tag;
                    break;
                case "html":
                    htmlEditor.value = tag;
                    break;
                case "js":
                    jsEditor.value = tag;
                    break;
            }
        });
        
        let newHtml = "";
        Object.values(tags).forEach((tag,i) => {
            if (tag != undefined) {
                newHtml += tag;
            }
        });
        let images = sessionStorage.getItem("images") ? JSON.parse(sessionStorage.getItem("images")) : [];
        images.forEach(file =>{
            //console.log(file.completePath);
            newHtml = newHtml.replace(`"${file.relativePath}"`, `"${file.completePath}"`);
            //console.log(text);
        })
        resultsIframe.srcdoc = newHtml;
        //console.clear();
    }
    
    render();

    cssEditor.addEventListener("input", (e) => {
        let selection = cssEditor.selectionStart;
        render("css", cssEditor.value);
        cssEditor.selectionStart = cssEditor.selectionEnd = selection;
    })
    linkEditor.addEventListener("input", (e) => {
        let selection = linkEditor.selectionStart;
        render("link", linkEditor.value);
        linkEditor.selectionStart = linkEditor.selectionEnd = selection;
    })
    scriptEditor.addEventListener("input", (e) => {
        let selection = scriptEditor.selectionStart;
        render("script", scriptEditor.value);
        scriptEditor.selectionStart = scriptEditor.selectionEnd = selection;
    })
    htmlEditor.addEventListener("input", (e) => {
        let selection = htmlEditor.selectionStart;
        render("html", htmlEditor.value);
        htmlEditor.selectionStart = htmlEditor.selectionEnd = selection;
    })
    jsEditor.addEventListener("input", (e) => {
        let selection = jsEditor.selectionStart;
        render("js", jsEditor.value);
        jsEditor.selectionStart = jsEditor.selectionEnd = selection;
    })
    const fileInput = document.getElementById('folder');
    let text = '<body><img src="" alt=""><img src="/img/adc.png" alt=""></body>'
    
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
                //console.log(item.completePath);
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
