// Player stub
var Player = function(userdata) {
    this.user = userdata;
    if (this.user.data)
        this.data = JSON.parse(this.user.data);
    else
        this.data = {};
}
Player.prototype = {
    getName: function() { return this.user.name },
    getLevelData: function(level, field) {
        if (!this.data[level]) this.data[level] = { _: [] };
        if (field == '_') return;
        return this.data[level][field];
    },
    setLevelData: function(level, field, value) {
        if (field == '_') return;
        var old = this.getLevelData(level, field);
        this.data[level][field] = value;
        // TODO save on server
    },
    getId: function(level, no) {
        return 'PLR='+this.user.id+',LVL='+level+",NO="+no;
    },
    setPassed: function(level, no) {
        this.getLevelData(level, '_');
        var id = this.getId(level, no)
        if (this.data[level]._.indexOf(id) < 0)
            this.data[level]._.push(id)
        // TODO save on server
    }

}




// Level stub
var Level = function(key, data) { 
    this.key = key;
    this.data = data;
}
Level.prototype = {
    bindPlayer: function(player) {
        this.player = player;
        return this;
    },
    bindViewport: function($viewport) {
        this.$ = $viewport;
        return this;
    },
    passedBy: function(player) {
        if (!player.data[this.key]) return false;
        var ids = player.data[this.key]._;
        var result = false;
        for (var i in this.data.times)
            if (ids.indexOf(this.player.getId(this.key, this.data.times[i][0])) >= 0) 
                return true;
        return false;
    },
    hasMoreFor: function(player) {
        if (!player.data[this.key]) return true;
        var ids = player.data[this.key]._;
        var result = false;
        for (var i in this.data.times)
            if (ids.indexOf(this.player.getId(this.key, this.data.times[i][0])) < 0) 
                return true;
    },
    getPassed: function(player) {
        if (!player.data[this.key]) return [];
        var ids = player.data[this.key]._;
        var result = [];
        for (var i in this.data.times)
            if (ids.indexOf(this.player.getId(this.key, this.data.times[i][0])) >= 0) 
                result.push(this.data.times[i]);
        return result;
    },
    oneMoreTime: function() {
        this.data.oneMoreTime(this.player, this);
        return this;
    },
    finalize: function() {
        if (this.data.finalize) this.data.finalize(this);
        $(document).off();
        this.$.off();
        this.$.html('');
    },
    complete: function(no) {
        this.player.setPassed(this.key, no);
        window.API.onComplete(no);
    }
}


var eternity = {
    isEnd: true,
    hasMoreForIds: function(ids) { return true; },
    oneMoreTime: function(player, level) {
        level.$.html('<div class="center-wrapper"><div class="label">Wait for more</div></div>');
    }
}
$(function(){
    window.API.registerLevel('ETERNITY', eternity);    
})


