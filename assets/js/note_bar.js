
function initNote(jqEl) {
    function initDraggable(jqEl) {
        jqEl.draggable({
            containment: "#view-seq",
            scroll: false,
            drag: function(event, ui) {
                magnetPosition($(this).find(".note"));
            },
            stop: function (event, ui) {
                var noteEl = $(this).find(".note");
                syncMagnetPosition(noteEl);
            }
        });
    }
    function initResizable(jqEl) {
        jqEl.resizable({
            containment: "#view-seq",
            handles: "e",
            resize: function (event, ui) {
                var noteEl = $(this).find(".note");
                var parent = noteEl.parent();
                var noteMagWidth = Math.round(parent.width() / beatWidth) * beatWidth;
                if (noteMagWidth > 0) {
                    noteEl.width(noteMagWidth);
                }
            }
        })
    }
    function magnetPosition(noteEl) {
        var innerNote = noteEl;
        var outerNote = noteEl.parent();
        var parent = outerNote.parent();
        var left = outerNote.offset().left - outerNote.parent().offset().left,
            top = outerNote.offset().top - outerNote.parent().offset().top;

        var gridLeft = Math.round(left / beatWidth) * beatWidth;
        var absGridLeft = gridLeft + parent.offset().left;
        innerNote.offset({left: absGridLeft});
        if (Math.abs(left - gridLeft) >= beatWidth/2) {
            outerNote.offset({left: absGridLeft});
        }

        var gridTop = Math.round(top / noteHeight) * noteHeight;
        var absGridTop = gridTop + parent.offset().top;
        innerNote.offset({top: absGridTop});
        if (Math.abs(top - gridTop) >= noteHeight/2) {
            outerNote.offset({top: absGridTop});
        }
    }
    function syncMagnetPosition(noteEl) {
        var outerNote = noteEl.parent();
        var off = noteEl.offset();
        outerNote.offset(off);
        noteEl.offset(off);
        initResizable(noteEl);
    }
    var noteEl = jqEl.find(".note");
    initDraggable(jqEl);
    initResizable(jqEl);
    magnetPosition(noteEl);
    syncMagnetPosition(noteEl);
}

// viewSeq background canvas
var viewSeq = $("#view-seq");
var c = $("<canvas></canvas>");
// $("body").append(c);
c.get()[0].setAttribute('width', viewSeq.width());
c.get()[0].setAttribute('height', viewSeq.height());
var ctx = c.get()[0].getContext('2d');
ctx.width = viewSeq.width();
ctx.height = viewSeq.height();
var noteHeight = 20;
var beatWidth = 80;
var noteCount = Math.floor(ctx.height / noteHeight);
var beatCount = Math.floor(ctx.width / beatWidth);

function drawBoard(ctx){
    ctx.beginPath();
    for (var iNote = 1; iNote < noteCount; iNote++) {
        ctx.moveTo(0, iNote * noteHeight);
        ctx.lineTo(ctx.width, iNote * noteHeight);
    }
    for (var iBeat = 1; iBeat < beatCount; iBeat++) {
        ctx.moveTo(iBeat * beatWidth, 0);
        ctx.lineTo(iBeat * beatWidth, ctx.height);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();
}
drawBoard(ctx);

// setup note
var domNote = "<div class='note-container'><div class='note'></div></div>";
viewSeq.click(function(event){
    if (currentTool && currentTool.attr('id') === "btn-pencil") {
        var note = $(domNote);
        $(this).append(note);
        note.css({
            left: event.offsetX - $(this).parent().offset().left,
            top: event.offsetY - $(this).parent().offset().top
        }).click(function(e){
            e.preventDefault();
        });
        initNote(note);
    }
}).css({
    background: "url(" + c.get()[0].toDataURL() + ")"
});
