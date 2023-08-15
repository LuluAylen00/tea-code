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

cssNewEditor.on("beforeChange", function(instance, change) {
    var maxLines = 30; // Límite máximo de líneas permitidas
    var currentLines = instance.lineCount(); // Obtener el número actual de líneas
    if (change.origin === "+input" && currentLines >= maxLines) {
    change.cancel(); // Cancelar la inserción de texto
    }
})