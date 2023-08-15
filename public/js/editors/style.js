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

linkNewEditor.on("beforeChange", function(instance, change) {
    var maxLines = 30; // Límite máximo de líneas permitidas
    var currentLines = instance.lineCount(); // Obtener el número actual de líneas
    if (change.origin === "+input" && currentLines >= maxLines) {
    change.cancel(); // Cancelar la inserción de texto
    }
})