var timeOut;

class Item {
    constructor(icon, backgroundColor, url) {
        this.$element = $(document.createElement("div"));
        this.icon = icon;
        this.$element.addClass("item");
        this.$element.css("background-color", backgroundColor);
        var i = document.createElement("i");
        $(i).addClass("fi-" + icon);
        var a = document.createElement("a");
        $(a).attr("href", url);
        $(a).attr("target", "_blank");
        $(a).append(i);
        this.$element.append(a);
        this.prev = null;
        this.next = null;
        this.isMoving = false;
        var element = this;
        this.$element.on("mousemove", function() {
            clearTimeout(timeOut);
            timeOut = setTimeout(function() {
                if (element.next && element.isMoving) {
                    element.next.moveTo(element);
                } 
            }, 10);
        });
    }
    
    moveTo(item) {
        anime({
            targets: this.$element[0],
            left: item.$element.css("left"),
            top: item.$element.css("top"),
            duration: 700,
            elasticity: 500
        });
        if (this.next) {
            this.next.moveTo(item);
        }
    }

    updatePosition() {    
        anime({
            targets: this.$element[0],
            left: this.prev.$element.css("left"),
            top: this.prev.$element.css("top"),
            duration: 80
        });
        
        if (this.next) {
            this.next.updatePosition();
        }
    }
}

class Menu {
    constructor(menu) {
        this.$element = $(menu);
        this.size = 0;
        this.first = null;
        this.last = null;
        this.timeOut = null;
        this.hasMoved = false;
        this.status = "closed";
    }
    
    add(item) {
        var menu = this;
        if (this.first == null) {
            this.first = item;
            this.last = item;
            this.first.$element.on("mouseup", function() {
                if (menu.first.isMoving) {
                    menu.first.isMoving = false;        
                } else {
                    menu.click();
                }
            }); 
            item.$element.draggable(
                {
                    start: function() {
                        menu.close();
                        item.isMoving = true;
                    }  
                },
                {
                    drag: function() {
                        if (item.next) {
                            item.next.updatePosition();
                        }
                    }
                },
                {
                    stop: function() {
                        item.isMoving = false;
                        item.next.moveTo(item);
                    }
                }
            );
        } else {
            this.last.next = item;
            item.prev = this.last;
            this.last = item;
        }
        this.$element.after(item.$element);
        
        
    }
    
    open() {
        this.status = "open";
        var current = this.first.next;
        var iterator = 1;
        var head = this.first;
        var sens = head.$element.css("left") < head.$element.css("right") ? 1 : -1;
        while (current != null) {
            anime({
                targets: current.$element[0],
                left: parseInt(head.$element.css("left"), 10) + (sens * (iterator * 50)),
                top: head.$element.css("top"),
                duration: 500
            });
            iterator++;
            current = current.next;
        }    
    }
    
    close() {
        this.status = "closed";
        var current = this.first.next;
        var head = this.first;
        var iterator = 1;
        while (current != null) {
            anime({
                targets: current.$element[0],
                left: head.$element.css("left"),
                top: head.$element.css("top"),
                duration: 500
            });
            iterator++;
            current = current.next;
        }
    }
    
    click() {
        if (this.status == "closed") {
            this.open();
        } else {
            this.close();
        }
    }
    
}

var menu = new Menu("#myMenu");
var item1 = new Item("list");
var item2 = new Item("social-instagram", "#DF1A1A");
var item3 = new Item("social-facebook", "#5CD1FF", "https://www.facebook.com/georgiades3");
var item4 = new Item("social-linkedin", "#FFF15C");
var item5 = new Item("paypal", "#64F592");
var item6 = new Item("photo", "#5A5697");
var item7 = new Item("mail", "#923E23");
var item8 = new Item("bitcoin", "#CF9C0C");
var item9 = new Item("social-steam", "#3C6F91");
var item10 = new Item("social-tiktok", "#A42583");

menu.add(item1);
menu.add(item2);
menu.add(item3);
menu.add(item4);
menu.add(item5);
menu.add(item6);
menu.add(item7);
menu.add(item8);
menu.add(item9);
menu.add(item10);
$(document).delay(50).queue(function(next) {
    menu.open();
    next();
    $(document).delay(1000).queue(function(next) {
        menu.close();
        next();
    });
});