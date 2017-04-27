var currentTool = $("#btn-pencil");
$("#tool-bar").find("> button").click(function () {
    $("#tool-bar").find("> button").prop('disabled', false);
    $(this).prop('disabled', true);
    currentTool = $(this);
});

