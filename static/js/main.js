
// Tiny preloader plugin
$.fn.preload = function(callback) {      
    var i=0, that = this;
    var increment = function() { if (++i >= that.length) return callback(that); }
    for (var j=0; j<that.length; j++)
        $('<img/>').load(increment)[0].src = that[j];
};

// Django CSRF support
$.ajaxSetup({ beforeSend: function(xhr, settings) {
    if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type)) && !this.crossDomain)
        xhr.setRequestHeader("X-CSRFToken", jQuery.cookie('csrftoken'));
}});

$(function(){

    $('body')
        .on('mousedown', '.button', function(){ $(this).addClass('button-pressed') })
        .on('mouseup',   '.button', function(){ $(this).removeClass('button-pressed') })
        .on('mouseout',  '.button', function(){ $(this).removeClass('button-pressed') })

})