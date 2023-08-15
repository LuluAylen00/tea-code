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

jsNewEditor.on("beforeChange", function(instance, change) {
    var maxLines = 30; // Límite máximo de líneas permitidas
    var currentLines = instance.lineCount(); // Obtener el número actual de líneas
    if (change.origin === "+input" && currentLines >= maxLines) {
    change.cancel(); // Cancelar la inserción de texto
    }
})