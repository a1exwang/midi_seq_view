$(document).keydown(function(key) {
    var ch = String.fromCharCode(key.which);
    $("button[data-shortcut='" + ch + "']:not([disabled])").trigger('click');
});