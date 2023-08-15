function getters(editor) {

    { /* html */
        var htmlEditor = document.getElementById("html-editor");
        var htmlNewEditor = CodeMirror.fromTextArea(document.getElementById("html-editor-textarea"), {
            mode: "text/html",
            theme: "material",
            lineNumbers: true,
            autoCloseTags: true, // Esto no funcionará sin el complemento closebrackets
            autoCloseBrackets: true,
            matchClosingTags: true,
            matchBrackets: true,
            indentUnit: 4,
            placeholder: "Ingresa tu código HTML aquí",
            foldGutter: true, // Habilita el plegado de código
            indentWithTabs: true,
            // extraKeys: { "Ctrl-Space": "autocomplete" },
            // hintOptions: {schemaInfo: htmlSchema},
            autocompletion: {
                enable: true,
                suggestOnTriggerChars: true,
                // Aquí puedes agregar configuraciones adicionales para el autocompletado
              },
            // Incluye el complemento closebrackets
            // que es necesario para la funcionalidad de autoCloseTags
            // extraPlugins: [CodeMirror.closeBrackets],
            // hint: CodeMirror.hint.html,
            completion: true
        });
        // console.log(htmlNewEditor.getValue());
        if (!editor) {
            htmlNewEditor.setOption('readOnly',true)
        }
        htmlNewEditor.on("beforeChange", function(instance, change) {
            // console.log(change);
            var maxLines = 30; // Límite máximo de líneas permitidas
            var currentLines = instance.lineCount(); // Obtener el número actual de líneas
            if (change.origin === "+input" && currentLines >= maxLines) {
                change.cancel(); // Cancelar la inserción de texto
            }
            const cursor = instance.getCursor();
            const line = instance.getLine(cursor.line);
            if (change.text[0] === '>' && !instance.somethingSelected()) {
                const tag = /<([a-zA-Z]+)[^>]*>?$/g.exec(line.slice(0, cursor.ch));
                if (tag) {
                  instance.replaceRange(`</${tag[1]}>`, cursor);
                  htmlNewEditor.setCursor(change.from.line,change.from.ch)
                }
                if (change.origin !== "complete") return;
        
                // const cursorB = htmlNewEditor.getCursor();
                // if (change.text.length === 1 && change.text[0] === ">") {
                //     const tag = change.text.join("");
                //     htmlNewEditor.replaceRange(tag, cursorB, cursorB);
                //     htmlNewEditor.setCursor(cursorB.line, cursorB.ch - 1);
                // }
            }
        
            // Expresión regular para encontrar la etiqueta HTML abierta
            const re = /<([a-zA-Z]+\b)[^>]*>([\s\S]*)$/;
            const match = line.match(re);
        
            if (match) {
                const [, tag, rest] = match;
        
                if (/* rest.trim() === "" &&  */change.text[1] == "") {
                // Insertar dos saltos de línea y una tabulación
                change.cancel();
                instance.replaceRange(`\n\t\n`, cursor);
                // change.update(null, null, ["\n", "\t", "\n"]);
        
                // Posicionar el cursor en la línea intermedia
                instance.setCursor(cursor.line + 1, 1);
                }
            }
            if (change.origin === "+input" && change.text[0] == "=") {
                // console.log("pasó");
                instance.replaceRange(`""`, cursor);
                // change.update(change.from, change.to, [change.text[0] + '""']);
                htmlNewEditor.setCursor(change.from.line,change.from.ch+1)
        
                // instance.setCursor({line: change.from.line, ch: change.from.ch + change.text[0].length + 1});
              }
        })
    }


    { /* css */
        var cssEditor = document.getElementById("css-editor");
        var cssNewEditor = CodeMirror.fromTextArea(document.getElementById("css-editor-textarea"), {
            lineNumbers: true,
            theme: "material",
            styleActiveLine: true,
            matchBrackets: true,
            mode: "css",
            autoCloseBrackets: true,
            viewportMargin: Infinity,
            indentUnit: 4,
            placeholder: "Ingresa tu código CSS aquí",
            indentWithTabs: true,
            tabSize: 4,
            lineWrapping: true,
            maxHeight: "200px",
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            fixedGutter: true
        });
        // console.log(cssNewEditor.getValue());
        if (!editor) {
            cssNewEditor.setOption('readOnly',true)
        }
        cssNewEditor.on("beforeChange", function(instance, change) {
            var maxLines = 30; // Límite máximo de líneas permitidas
            var currentLines = instance.lineCount(); // Obtener el número actual de líneas
            if (change.origin === "+input" && currentLines >= maxLines) {
            change.cancel(); // Cancelar la inserción de texto
            }
        })
    }

    { /* js */
        var jsEditor = document.getElementById("js-editor");
        var jsNewEditor = CodeMirror.fromTextArea(document.getElementById("js-editor-textarea"), {
            lineNumbers: true,
            theme: "material",
            styleActiveLine: true,
            matchBrackets: true,
            mode: "javascript",
            autoCloseBrackets: true,
            viewportMargin: Infinity,
            indentUnit: 4,
            indentWithTabs: true,
            placeholder: "Ingresa tu código JS aquí",
            tabSize: 4,
            lineWrapping: true,
            maxHeight: "200px",
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            fixedGutter: true
        });
        // console.log(jsNewEditor.getValue());
        if (!editor) {
            jsNewEditor.setOption('readOnly',true)
        }
        jsNewEditor.on("beforeChange", function(instance, change) {
            var maxLines = 30; // Límite máximo de líneas permitidas
            var currentLines = instance.lineCount(); // Obtener el número actual de líneas
            if (change.origin === "+input" && currentLines >= maxLines) {
            change.cancel(); // Cancelar la inserción de texto
            }
        })
    }

    
    { /* script */
        var scriptEditor = document.getElementById("script-editor");
        var scriptNewEditor = CodeMirror.fromTextArea(document.getElementById("script-editor-textarea"), {
            placeholder: '<script type="text/javascript" src="...."></script>',
            mode: "text/html",
            theme: "material",
            lineNumbers: true,
            autoCloseTags: true, // Esto no funcionará sin el complemento closebrackets
            autoCloseBrackets: true,
            matchClosingTags: true,
            matchBrackets: true,
            indentUnit: 4,
            foldGutter: true, // Habilita el plegado de código
            indentWithTabs: true,
            // extraKeys: { "Ctrl-Space": "autocomplete" },
            // hintOptions: {schemaInfo: htmlSchema},
            autocompletion: {
                enable: true,
                suggestOnTriggerChars: true,
                // Aquí puedes agregar configuraciones adicionales para el autocompletado
              },
            // Incluye el complemento closebrackets
            // que es necesario para la funcionalidad de autoCloseTags
            // extraPlugins: [CodeMirror.closeBrackets],
            // hint: CodeMirror.hint.html,
            completion: true
        });
        // console.log(scriptNewEditor.getValue());
        if (!editor) {
            scriptNewEditor.setOption('readOnly',true)
        }
        scriptNewEditor.on("beforeChange", function(instance, change) {
            var maxLines = 30; // Límite máximo de líneas permitidas
            var currentLines = instance.lineCount(); // Obtener el número actual de líneas
            if (change.origin === "+input" && currentLines >= maxLines) {
            change.cancel(); // Cancelar la inserción de texto
            }
        })
    }

    { /* link */
        var linkEditor = document.getElementById("link-editor");
        var linkNewEditor = CodeMirror.fromTextArea(document.getElementById("link-editor-textarea"), {
            lineNumbers: true,
            theme: "material",
            styleActiveLine: true,
            matchBrackets: true,
            mode: "text/html",
            autoCloseBrackets: true,
            viewportMargin: Infinity,
            indentUnit: 4,
            indentWithTabs: true,
            placeholder: '<link rel="stylesheet" href="...."/>',
            tabSize: 4,
            lineWrapping: true,
            maxHeight: "200px",
            foldGutter: true, // Habilita el plegado de código
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            fixedGutter: true
        });
        // console.log(linkNewEditor.getValue());
        if (!editor) {
            linkNewEditor.setOption('readOnly',true)
        }
        linkNewEditor.on("beforeChange", function(instance, change) {
            var maxLines = 30; // Límite máximo de líneas permitidas
            var currentLines = instance.lineCount(); // Obtener el número actual de líneas
            if (change.origin === "+input" && currentLines >= maxLines) {
            change.cancel(); // Cancelar la inserción de texto
            }
        })
    }

    

    return {
        html: {
            editor: htmlEditor,
            newEditor: htmlNewEditor,
        },
        css: {
            editor: cssEditor,
            newEditor: cssNewEditor,
        },
        js: {
            editor: jsEditor,
            newEditor: jsNewEditor,
        },
        script: {
            editor: scriptEditor,
            newEditor: scriptNewEditor,
        },
        link: {
            editor: linkEditor,
            newEditor: linkNewEditor,
        },
        
    }
}