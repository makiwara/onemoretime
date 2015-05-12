window.API.registerLevel('Click Here Level One', {
    times: [
            ["here", "Click Here"],
            ["not",  "Click Not Here"],
            ["spot", "Click Wait Here"],
            ["99",   "Click 99 Here"],
            ["99hack", "Hack 99 Here"],
            ["99key", "Key 99 Here"]
        ],
    getNext: function(player, level) {
        if (!player.data[level.key]) return this.times[0][0];
        var ids = player.data[level.key]._;
        for (var i in this.times)
            if (ids.indexOf(player.getId(level.key, this.times[i][0])) < 0) 
                return this.times[i][0];
    },
    oneMoreTime: function(player, level) {
        var next = this.getNext(player, level);
        switch(next){
            case "here":
                level.$.html('<div class="center-wrapper"><div class="button">Click Here</div></div>');
                level.$.find('.button').click(function(){
                    level.complete(next);
                })
                break;
            case "not":
                level.$.html('<div class="center-wrapper"><div class="button">Click Not Here</div></div>');
                level.$.one('click', function(){
                    level.complete(next);
                })
                level.$.find('.button').click(function(){ return false });
                break;
            case "99key":
            case "99hack":
            case "99":
                var t2 = 99;
                var t3 = 99;
                level.$.html('<div class="center-wrapper"><div class="button">Click 99 Here</div></div>');
                $(document).keypress(function(){
                    t3--;
                    level.$.find('.button').click();    
                });
                level.$.find('.button').click(function(){
                    t = parseInt($(this).html().split(' ')[1], 10);
                    t--; t2--;
                    if (t == 0) 
                        if (t2 == t)
                            if (t3 > 0)
                                level.complete('99');
                            else
                                level.complete('99key');
                        else
                            level.complete('99hack');
                    else $(this).html('Click '+t+ ' Here');
                })
                break;
            case "spot":
                level.$.html('<div class="center-wrapper"><div class="button">Click Here</div></div>');
                level.$.click(function(){
                    var start = parseInt(500 + Math.random()*2000);
                    setTimeout(function(){ level.$.find('.button').show() }, start);
                    setTimeout(function(){ level.$.find('.button').hide() }, start+500);
                })
                level.$.find('.button').hide().click(function(){
                    level.complete(next);
                })
                break;
        }
    }    
});