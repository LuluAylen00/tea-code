// let htmlTags = ["html","body","header","main","footer","a","p","i","b","h1","h2","h3","h4","h5","h6","section","article","picture","ul","li","div","input","img","nav"];
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

window.addEventListener('load',() => {
    var socket
    socket = io();

    socket.on('connected-list', (data) => {
        renderPlayers(data);
        // console.log("players",data);
    })
    
    socket.on('spect-list', (data) => {
        renderSpects(data);
        // console.log("spectators",data);
    })

    socket.on('board-list', (data) => {
        renderBoards(data);
        // console.log("boards",data);
    })

    

    function displayOpt() {
        let opt = document.getElementById('opt');
        let button = document.createElement("button");
        button.addEventListener('click',() => {
            Swal.fire({
                title: 'Que titulo tendrá el tablero?',
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off',
                    autocomplete: 'off',
                },
                inputValidator: (value) => {
                    if (value.length < 3) {
                        return 'El título debe tener al menos 3 letras';
                    }
                },
                confirmButtonText: 'Crear tablero',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true
                // allowOutsideClick: false
            }).then((valor) => {
                // console.log(valor);
                if (valor.isConfirmed) {
                    Swal.fire({
                        title: 'Establece una contraseña para el editor',
                        input: 'password',
                        inputAttributes: {
                            autocapitalize: 'off'
                        },
                        confirmButtonText: 'Confirmar',
                        showCancelButton: true,
                        cancelButtonText: 'No quiero',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: true
                    }).then((result) => {
                        // console.log(result);
                        // console.log("asdasdasdasd", valor, result);
                        console.log(socket.id);
                        socket.emit("new-board", {
                            id: socket.id,
                            title: valor.value,
                            password: result.value || null
                            // owner: playerList.find(p => p.id == socket.id)
                        });
                    })
                }
            })
        })
        button.innerHTML = "Crear tablero"
        opt.appendChild(button);
    }

    // Obtener el elemento <ul> de la lista de jugadores
    var playerList = document.querySelector('#users-dropdown');
    var pQ = document.querySelector('.players p');
    function renderPlayers(list) {
        playerList.innerHTML = "";
        pQ.innerHTML = list.length;

        list.forEach(p => {
            // Crear un nuevo elemento <li> para el jugador
            // var newPlayer = document.createElement('li');
            
            // newPlayer.textContent = p.name; // player name es el nombre del jugador
        
            // Agregar el nuevo elemento <li> a la lista de jugadores
            playerList.innerHTML += `<li><p class="dropdown-item" href="#">${p.name}</p></li>`;
        })
    }

    // var boardList = document.querySelector('.board-list');
    var bQ = document.querySelector('.boards p');
    var boardsDropdown = document.querySelector("#boards-dropdown");
    function renderBoards(list) {
        // boardList.innerHTML = "";
        boardsDropdown.innerHTML = ""
        bQ.innerHTML = list.length;
        // console.log("list", list);
        list.forEach(b => {
            // Crear un nuevo elemento <li> para el tablero
            // var newBoard = document.createElement('li');
            // newBoard.innerHTML = `${b.id}: ${b.title} (de ${b.owner.name}) ${b.password ? '<i class="fas fa-lock"></i>' : ""}`; 
        
            let editorDisplay = document.getElementById('editor-display')
            // let fb = document.createElement('button')
            // fb.classList.add('enterBtn')
            function openEditors(){
                editorDisplay.innerHTML = `
                <section class="editor-container">
                    <input type="radio" name="selected-editor" id="html-selected" checked>
                    <input type="radio" name="selected-editor" id="css-selected">
                    <input type="radio" name="selected-editor" id="js-selected">
                    <input type="radio" name="selected-editor" id="script-selected">
                    <input type="radio" name="selected-editor" id="link-selected">
                    <div class="editor-header">
                        <div class="editor-nav">
                            <label for="html-selected">index.html</label>
                            <label for="css-selected">index.css</label>
                            <label for="js-selected">index.js</label>
                        </div>

                        <div class="adder-nav">
                            <label for="link-selected">+ Link</label>
                            <label for="script-selected">+ Script</label>
                        </div>
                    </div>
                    <div class="editors">
                        <div id="html-editor" class="editor">
                            <textarea class="editor" name="html-editor" id="html-editor-textarea"></textarea>
                        </div>
                        <div id="css-editor" class="editor">
                            <textarea class="editor" name="css-editor" id="css-editor-textarea"></textarea>
                        </div>
                        <div id="js-editor" class="editor">
                            <textarea class="editor" name="js-editor" id="js-editor-textarea"></textarea>
                        </div>
                        <div id="link-editor" class="editor">
                            <textarea class="editor" name="link-editor" id="link-editor-textarea"></textarea>
                        </div>
                        <div id="script-editor" class="editor">
                            <textarea class="editor" name="script-editor" id="script-editor-textarea"></textarea>
                        </div>
                    </div>
                    <div class="editor-footer">
                        <div>
                            <input type="file" id="folder" webkitdirectory directory multiple class="dn"/>
                            <label for="folder"><i class="fas fa-upload"></i> Cargar carpeta public</label>
                            <span id="info-cont">
                                <i id="fa-info-circle" class="fas fa-info-circle"></i>
                                <span>
                                    <p>Nota: la carpeta no se subirá al sitio, se alojará de forma temporal en el navegador y se eliminará al cerrar el navegador</p>
                                </span>
                            </span>
                        </div>
                        <script>
                            
                        </script>
                        <span id="run-js">Ejecutar >>></span>
                    </div>
                </section>
                <iframe id="results"></iframe>
                `
                let runJs = document.getElementById("run-js");
                let resultsIframe = document.getElementById("results");

                // console.log("includes", b.editors.includes(socket.id));
                // console.log("owner", b.owner.id == socket.id);
                let code = getters(b.editors.includes(socket.id) || b.owner.id == socket.id);

                // editorContainer.style.display = 'none';
                // resultsIframe.style.display = 'none';

                let main = document.getElementById("main");
                let div = document.createElement("div");
                // div.inner

                let tags = {
                    headOpener: "<head>",
                    link: b.code.link,
                    script: b.code.script,
                    headCloser: "</head>",
                    bodyOpener: "<body>",
                    mainOpener: "<main>",
                    html: b.code.html,
                    mainCloser: "</main>",
                    styleOpener: "<style>",
                    css: b.code.css || `body {\n\tbackground-color: #151416;\n}`,
                    styleCloser: "</style>",
                    scriptOpener: "<script>",
                    js: b.code.js,
                    scriptCloser: "</script>",
                    bodyCloser: "</body>"
                }

                function load() {
                    let sessionHtml = tags;

                    let nameTags = Object.keys(tags);
                    // console.log("sessionHtml", sessionHtml);
                    // console.log(nameTags);
                    tags = sessionHtml;

                    // tags[type] = value;
                    // console.log("tags",tags);
                    sessionStorage.setItem("html", JSON.stringify(tags));
                    // console.log(type);
                    // console.log(code);
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
                                code.css.newEditor.setValue(tags[nameTags[i]]);
                                break;
                            case "link":
                                code.link.newEditor.setValue(tags[nameTags[i]]);
                                break;
                            case "script":
                                code.script.newEditor.setValue(tags[nameTags[i]]);
                                break;
                            case "html":
                                code.html.newEditor.setValue(tags[nameTags[i]]);
                                break;
                            case "js":
                                code.js.newEditor.setValue(tags[nameTags[i]]);
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
                    // let code = getters();
                    Object.values(tags).forEach((tag,i) => {
                        if (tag != undefined) {
                            newHtml += tag;
                        }
                    });
                    switch (type){
                        case "css":
                            tags.css = code.css.newEditor.getValue()
                            break;
                        case "link":
                            // console.log("link");
                            tags.link = code.link.newEditor.getValue()
                            break;
                        case "script":
                            // console.log("script");
                            tags.script = code.script.newEditor.getValue()
                            break;
                        case "html":
                            tags.html = code.html.newEditor.getValue()
                            break;
                        case "js":
                            tags.js = code.js.newEditor.getValue();
                            validarCodigo(code.js.newEditor.getValue())
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

                socket.on('updated', (data) =>{
                    // console.log(data);
                    if (data.editor != socket.id) {
                        tags = {
                            headOpener: "<head>",
                            link: data.board.code.link,
                            script: data.board.code.script,
                            headCloser: "</head>",
                            bodyOpener: "<body>",
                            mainOpener: "<main>",
                            html: data.board.code.html,
                            mainCloser: "</main>",
                            styleOpener: "<style>",
                            css: data.board.code.css,
                            styleCloser: "</style>",
                            scriptOpener: "<script>",
                            js: data.board.code.js,
                            scriptCloser: "</script>",
                            bodyCloser: "</body>"
                        }
                        load();
                        render();
                    }
                })

                code.css.editor.addEventListener("keyup", (e) => {
                    socket.emit('board-update', {board: b.id, field: "css", data: code.css.newEditor.getValue(), editor: socket.id});
                    render("css", code.css.newEditor.getValue());
                })
                code.link.editor.addEventListener("keyup", (e) => {
                    socket.emit('board-update', {board: b.id, field: "link", data: code.link.newEditor.getValue(), editor: socket.id});
                    render("link", code.link.newEditor.getValue());
                })
                code.script.editor.addEventListener("keyup", (e) => {
                    socket.emit('board-update', {board: b.id, field: "script", data: code.script.newEditor.getValue(), editor: socket.id});
                    render("script", code.script.newEditor.getValue());
                })
                code.html.editor.addEventListener("keyup", (e) => {
                    socket.emit('board-update', {board: b.id, field: "html", data: code.html.newEditor.getValue(), editor: socket.id});
                    render("html", code.html.newEditor.getValue());
                })
                runJs.addEventListener("click", (e) => {
                    socket.emit('board-update', {board: b.id , field: "js", data: code.js.newEditor.getValue(), editor: socket.id});
                    let selection = js.editor.selectionStart;
                    render("js", code.js.newEditor.getValue());
                    js.editor.selectionStart = js.editor.selectionEnd = selection;
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
                // socket.emit("delete-board", b.id)
            }
            // fb.addEventListener('click', openEditors)
            // fb.innerHTML = '<i class="fas fa-sign-in-alt"></i>'
            // newBoard.appendChild(fb)

            
            // Agregar el nuevo elemento <li> a la lista de tableros
            // boardList.appendChild(newBoard);
            
            // boardsDropdown.innerHTML += `<li><p class="dropdown-item" href="#"></p></li>`
            let dropItem = document.createElement('li');
            dropItem.addEventListener('click', openEditors)
            let pItem = document.createElement('p');
            pItem.classList.add("dropdown-item");
            pItem.setAttribute('href', '#');
            pItem.innerHTML = `${b.id}: ${b.title} (de ${b.owner.name}) ${b.password ? '<i class="fas fa-lock"></i>' : ""}`;

            if (sessionStorage.getItem('user') == "Strapitacus") {
                let sb = document.createElement('button');
                sb.classList.add('deleteBtn');
                sb.addEventListener('click', () =>{
                    socket.emit("delete-board", b.id);
                })
                sb.innerHTML = '<i class="fas fa-x"></i>';
                pItem.appendChild(sb);
            }

            dropItem.appendChild(pItem);
            boardsDropdown.appendChild(dropItem);
        })


    }

    var spectatorList = document.querySelector('.spectators p');
    function renderSpects(list) {
        spectatorList.innerHTML = list.length;
    }

    Swal.fire({
        title: 'Introduce tu nombre',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off',
            autocomplete: 'off'
        },
        inputValidator: (value) => {
            if (value.length < 3) {
                return 'El nombre debe tener al menos 3 letras';
            }
        },
        confirmButtonText: 'Entrar',
        showCancelButton: true,
        cancelButtonText: 'Solo ver',
        showLoaderOnConfirm: true,
        preConfirm: (name) => {
            sessionStorage.setItem("user",name);
        },
        // allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            // console.log("socket",socket);
            socket.emit("new-connected", sessionStorage.getItem("user"));
            displayOpt();
        } else {
            socket.emit("new-spect");
        }
    })

})

// window.addEventListener('beforeunload', (event) => {
//     // aquí puedes emitir el evento que desees antes de que el socket se desconecte
//     socket.emit('unconnecting', sessionStorage.getItem('user'));
//     // unjoin(sessionStorage.getItem("user"))
// });