$(function () {
    function initNote(noteContainer) {
        function initDraggable(noteContainer) {
            noteContainer.draggable({
                containment: "#view-seq",
                scroll: false,
                drag: function() {
                    magnetPosition($(this).find(".note"));
                },
                stop: function () {
                    var noteEl = $(this).find(".note");
                    syncMagnetPosition(noteEl);
                }
            });
        }
        function initResizable(noteContainer) {
            noteContainer.resizable({
                containment: "#view-seq",
                handles: "e",
                resize: function (event, ui) {
                    var noteEl = $(this).find(".note");
                    var parent = noteEl.parent();
                    var noteMagWidth = Math.round(parent.width() / beatWidth) * beatWidth;
                    if (noteMagWidth > 0) {
                        noteEl.width(noteMagWidth);
                        window.resizeCC(noteContainer.attr('cc_id'), noteMagWidth);
                    }
                },
                stop: function (event, ui) {
                    var noteEl = $(this).find(".note");
                    var noteContainer = noteEl.parent();
                    noteContainer.width(noteEl.width());
                }
            });
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
            window.moveCC(outerNote.attr('cc_id'), gridLeft);
            if (Math.abs(left - gridLeft) >= beatWidth/2) {
                outerNote.offset({left: absGridLeft});
            }

            var gridTop = Math.round(top / noteHeight) * noteHeight;
            var absGridTop = gridTop + parent.offset().top;
            innerNote.offset({top: absGridTop});
            if (Math.abs(top - gridTop) >= noteHeight/2) {
                outerNote.offset({top: absGridTop});
            }
            noteEl.get()[0].innerHTML = getNoteName((noteCount - Math.round(gridTop / noteHeight)) + 35);
        }
        function syncMagnetPosition(noteEl) {
            var noteContainer = noteEl.parent();
            var off = noteEl.offset();
            noteContainer.offset(off);
            noteEl.offset(off);
        }
        var noteEl = noteContainer.find(".note");
        initDraggable(noteContainer);
        initResizable(noteContainer);
        magnetPosition(noteEl);
        syncMagnetPosition(noteEl);
        noteContainer.click(function (e) {
            if (currentTool.attr('id') === "btn-eraser") {
                window.removeCC(noteContainer.attr('cc_id'));
                noteContainer.remove();
            }
            e.stopPropagation();
        });
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
            var noteContainer = $(domNote);
            $(this).append(noteContainer);
            noteContainer.css({
                left: event.offsetX - $(this).parent().offset().left,
                top: event.offsetY - $(this).parent().offset().top
            });
            initNote(noteContainer);
            noteContainer.attr('cc_id', window.addCC(noteContainer.position().left, 100, 80))
        }
    }).css({
        background: "url(" + c.get()[0].toDataURL() + ")"
    });
});
