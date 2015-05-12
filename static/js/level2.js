window.API.registerLevel('Click Here Level Two', {
    times: [
            ["click-here",  "Click Here"],
            ["here-click",  "Here Click"],
            ["click+here",  "Click+Here"],
            ["drag",   "Drag Here"]
        ],
    getNext: function(player, level) {
        if (!player.data[level.key]) return this.times[0][0];
        var ids = player.data[level.key]._;
        for (var i in this.times)
            if (ids.indexOf(player.getId(level.key, this.times[i][0])) < 0) 
                return this.times[i][0];
    },
    oneMoreTime: function(player, level) {
        level.$.html(['<div class="center-wrapper">',
            '<table style="width:100%;"><tr>',
            '<td><div class="button button-click">Click</div></td>',
            '<td><div class="button button-here">Here</div></td>',
            '</tr></table></div>'].join(""));
        var prev = "";
        level.$.find('.button-click').click(function(){
            if (key == "here") level.complete('click+here');
            else
                if (prev == "here") level.complete('here-click');
                else prev = "click";
        })
        level.$.find('.button-here').click(function(){
            if (prev == "click") level.complete('click-here');
            else prev = "here";
        })
        level.$.find('.button')
            .css({position:'relative'})
            .draggable({
                start: function(){ $(this).css({ opacity: 0.75, 'z-index':800 }); },
                stop:  function(){ $(this).css({ opacity: 1,    'z-index':200 }); }
            })
            .droppable({
                over: function(){ setTimeout(function(){ level.complete('drag') },1) },
            })
        var key = "";
        $(document)
            .keydown(function(){
                key = "here";
                level.$.find('.button-here').addClass('button-pressed');
            })
            .keyup(function(){
                key = "";
                level.$.find('.button-here').removeClass('button-pressed');
            });            
    }    
});