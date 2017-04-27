$(document).ready(function() {
    function initNote(jqEl) {
        jqEl.draggable({
            containment: "#view-seq",
            scroll: false,
            drag: function(event, ui) {
                console.log(ui.position);
            }
        }).resizable({
            containment: "#view-seq",
            handles: "e",
            resize: function (event, ui) {
                console.log(ui.size.width)
            }
        });
    }

    var currentTool = $("#btn-pencil");
    $("#tool-bar").find("> button").click(function () {
        $("#tool-bar").find("> button").prop('disabled', false);
        $(this).prop('disabled', true);
        currentTool = $(this);
    });
    var domNote = "<div style=\"cursor: default; width: 80px; height: 20px; background-color: lightgreen;\" ></div>";
    $("#view-seq").click(function(event){
        if (currentTool && currentTool.attr('id') === "btn-pencil") {
            var note = $(domNote);
            $(this).append(note);
            note.css({
                position: 'absolute',
                left: event.offsetX - $(this).parent().offset().left,
                top: event.offsetY - $(this).parent().offset().top
            });
            initNote(note);
        }
    });
});
