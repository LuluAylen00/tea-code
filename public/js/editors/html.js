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
// htmlNewEditor.setOption("mode", "text/html");

// htmlNewEditor.foldCode(CodeMirror.Pos(fromLine, 0), CodeMirror.Pos(toLine, 0));

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