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

scriptNewEditor.on("beforeChange", function(instance, change) {
    var maxLines = 30; // Límite máximo de líneas permitidas
    var currentLines = instance.lineCount(); // Obtener el número actual de líneas
    if (change.origin === "+input" && currentLines >= maxLines) {
    change.cancel(); // Cancelar la inserción de texto
    }
})