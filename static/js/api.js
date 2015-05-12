var API = function() {
    this.levels = [];
    this.view_render();
};
API.prototype = {

    // LEVEL =======================================================================
    // LEVEL =======================================================================
    // LEVEL =======================================================================
    // LEVEL =======================================================================
    // LEVEL =======================================================================
    level: false,
    registerLevel: function(key, levelData) {
        this.levels[ this.levels.length ]= new Level(key, levelData);
    },
    finalize: function() {
        if (this.level)
            this.level.finalize();
    },
    oneMoreTime: function(level) {
        if (!level)
            level = this.getNextLevel();
        this.level = level
            .bindPlayer(this.player)
            .bindViewport($('.game-viewport'))
            .oneMoreTime();
    },
    getNextLevel: function(level) {
        for (var l=0; l<this.levels.length; l++) {
            if (!this.player.data[ this.levels[l].key ]) {
                return this.levels[l];
            }
        }
        return false;
    },


    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    onAuth: function(user) {
        window.API.user = user;
        window.API.player = new Player(user);
        if (window.API.user.success) {
            this.view_authSuccess();
            this.onRestart();
        }
        else
            this.view_authFailure();
    },


    onStart: function() {
        $('.start-wrapper').hide();
        window.API.authSource = this;
        var w = "500";
        var h = "500";
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open(window.API.loginUrl, 'auth', 'width='+w+',height='+h+',left='+left+',top='+top);        
    },

    onPause: function() {
        $('.pause').show();
        $('.pause-chat').hide();
        $('.pause-info').show();
        // rebuild pause ---------------------------------------------
        $('.pause-level').text(this.level.key)
        // HAS MORE
        if (this.level.hasMoreFor(this.player) && !this.level.data.isEnd) 
            $('.pause-info .button-restart').show()
        else
            $('.pause-info .button-restart').hide()
        // CHAT + NEXT
        if (this.level.passedBy(this.player))
            $('.pause-info .button-chat, .pause-info .button-next').show()
        else
            $('.pause-info .button-chat, .pause-info .button-next').hide()
        // SOLUTIONS
        $('.pause-solutions').html('')
        if (this.level.data.isEnd)
            $('.pause-solutions').html('<div class="pause-end">You have reached The Rim.<br>There would be more later.</div>')
        var passed = this.level.getPassed(this.player);
        if (passed.length == 0)
            $('.pause-solutions').html('<div class="pause-end">No solution found. Yet.</div>')
        passed.map(function(x){
            $('.pause-solutions').append('<div class="pause-solution pause-solution-hint-'+x[0]+'">'+x[1]+'</div>')
        })
        // -----------------------------------------------------------
    },
    onChat: function() {
        if (!this.level.passedBy(this.player)) return;
        $('.pause').show();
        $('.pause-info').hide();
        $('.pause-chat').show();
        $('.pause-chat textarea').focus();
        // load fresh chat messages
    },
    onResume: function() {
        $('.pause').hide();
    },
    onRestart: function() {
        var level = this.level;
        this.finalize();
        this.oneMoreTime(level);
        this.onResume()
    },
    onNext: function() {
        if (!this.level.passedBy(this.player)) return;
        var nextLevel = this.getNextLevel();
        this.finalize()
        this.oneMoreTime(nextLevel);
        this.onResume()
    },
    onComplete: function(no) {
        this.onPause();
        $('.pause-solutions .pause-solution-hint-'+no).addClass('pause-solution-recent');
        this.finalize()
    },

    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    view_authFailure: function() {
        $('.start-wrapper').show();
    },
    view_authSuccess: function() {
        $('.start').hide();
    },
    view_render: function() {
        var prerender = [
            '<div class="game">',
                '<div class="game-viewport"></div>',
                '<div class="button button-pause">MENU</div>',
            '</div>',
            '<div class="start">',
                '<div class="start-wrapper">',
                '<div class="button">ONE MORE TIME</div>',
                '</div>',
            '</div>',
            '<div class="pause">',
                '<div class="pause-window">',
                    '<div class="pause-level">Level one</div>',
                    '<div class="pause-info">',
                        '<div class="pause-solutions">',
                            '<div class="pause-solution pause-solution-recent">Simple click</div>',
                            '<div class="pause-solution">Make fingers dance</div>',
                            '<div class="pause-solution">Fly like an angel will do</div>',
                            '<div class="pause-solution">Greater love</div>',
                            '<div class="pause-solution">This one is last</div>',
                            '<div class="pause-solution">No this one is</div>',
                        '</div>',
                        '<div class="pause-buttons">',
                            '<div class="button button-chat">CHAT</div>',
                            '<div class="button button-restart">ONE MORE TIME</div>',
                            '<div class="button button-next">NEXT</div>',
                        '</div>',
                    '</div>',
                    '<div class="pause-chat">',
                        '<div class="pause-chats">',
                            '<div class="pause-chat-admin">Hello, I am The Game Master!</div>',
                            '<div class="pause-chat-admin pause-chat-glue">Please share with us your impressions and thoughts on the level you just passed.</div>',
                            '<div class="pause-chat-admin pause-chat-glue">If you have a bright new idea of another solution to this level, please do tell.</div>',
                            '<div class="pause-chat-admin pause-chat-glue">I will implement the interesing ones and reward you.</div>',
                        '</div>',
                        '<textarea placeholder="Type your idea of walk-through here and hit Enter to send"></textarea>',
                        '<div class="chat-buttons">',
                            '<div class="button button-chat">CLOSE CHAT</div>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="button button-unpause">BACK</div>',
            '</div>'
        ].join("");
        $('body').append(prerender)

        $('.start .button').click(function(){ window.API.onStart() })
        $('.game .button-pause').click(function(){ window.API.onPause() })
        $('.pause .button-unpause').click(function(){ window.API.onResume() })
        $('.pause-chat .button-chat').click(function(){ window.API.onPause() })
        $('.pause-info .button-chat').click(function(){ window.API.onChat() })
        $('.pause-info .button-next').click(function(){ window.API.onNext() })
        $('.pause-info .button-restart').click(function(){ window.API.onRestart() })

    },

    // EOF
    undef: function(u) { return u }
}
window.API = new API();


// TEMP TODO remove
$(function(){
    window.API.onAuth({
        success: true,
        name: 'Test User',
        id: 'tu',
        userpic: '//pbs.twimg.com/profile_images/378800000819237203/5609dc6484d5bfa80d440fa7183be09d.jpeg',
        email: 'mendokusee@gmail.com',
        data: ''
    });    
})
