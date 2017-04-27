$(function() {
    function initCC(ccContainer) {
        function initDraggable(ccContainer) {
            ccContainer.draggable({
                containment: "#view-cc",
                scroll: false,
                axis: "y",
                drag: function() {
                },
                stop: function () {
                }
            });
        }
        initDraggable(ccContainer);
    }

    // viewCC background canvas
    var viewCC = $("#view-cc");
    var c = $("<canvas></canvas>");
    // $("body").append(c);
    c.get()[0].setAttribute('width', viewCC.width());
    c.get()[0].setAttribute('height', viewCC.height());
    var ctx = c.get()[0].getContext('2d');
    ctx.width = viewCC.width();
    ctx.height = viewCC.height();
    var ccHeight = 40;
    var beatWidth = 80;
    var ccCount = Math.floor(ctx.height / ccHeight);
    var beatCount = Math.floor(ctx.width / beatWidth);

    function drawBoard(ctx){
        ctx.beginPath();
        for (var iNote = 1; iNote < ccCount; iNote++) {
            ctx.moveTo(0, iNote * ccHeight);
            ctx.lineTo(ctx.width, iNote * ccHeight);
        }
        for (var iBeat = 1; iBeat < beatCount; iBeat++) {
            ctx.moveTo(iBeat * beatWidth, 0);
            ctx.lineTo(iBeat * beatWidth, ctx.height);
        }
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
    drawBoard(ctx);

    viewCC.css({
        background: "url(" + c.get()[0].toDataURL() + ")"
    });

    function addCC(left, top, width) {
        var ccId = 'cc_' + window.ccCounter;
        window.ccCounter++;
        var domNote = "<div class='cc-container' id='" + ccId + "'><div class='cc'></div></div>";

        var ccContainer = $(domNote);
        viewCC.append(ccContainer);
        ccContainer.offset({
            left: left + ccContainer.parent().offset().left,
            top: top + ccContainer.parent().offset().top
        });
        ccContainer.css({
            width: width
        });
        initCC(ccContainer);
        return ccId;
    }
    function removeCC(ccId) {
        var ccContainer = $("#" + ccId);
        ccContainer.remove();
    }
    function moveCC(ccId, left) {
        var ccContainer = $("#" + ccId);
        if (ccId !== undefined)
            ccContainer.offset({left: left + ccContainer.parent().offset().left})
    }
    function resizeCC(ccId, width) {
        var ccContainer = $("#" + ccId);
        if (ccId !== undefined) {
            ccContainer.width(width);
        }
    }
    window.addCC = addCC;
    window.removeCC = removeCC;
    window.moveCC = moveCC;
    window.resizeCC = resizeCC;
    window.ccCounter = 0;
});
