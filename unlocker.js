(function() {
    // Set preserveDrawingBuffer to true, so we can save canvas as image :)
    // Source from https://github.com/greggman/webgl-helpers/blob/master/webgl-force-preservedrawingbuffer.js
    if (typeof HTMLCanvasElement !== "undefined") {
        wrapGetContext(HTMLCanvasElement);
    }
    if (typeof OffscreenCanvas !== "undefined") {
        wrapGetContext(OffscreenCanvas);
    }

    function wrapGetContext(ContextClass) {
        const isWebGL = /webgl/i;

        ContextClass.prototype.getContext = function(origFn) {
            return function(type, attributes) {
                if (isWebGL.test(type)) {
                    attributes = Object.assign({}, attributes || {}, {preserveDrawingBuffer: true});
                }
                return origFn.call(this, type, attributes);
            };
        }(ContextClass.prototype.getContext);
    }

    // Context menu is not allowed, so we need to re-enable it :)
    // Source from https://greasyfork.org/scripts/23772-absolute-enable-right-click-copy/code/Absolute%20Enable%20Right%20Click%20%20Copy.user.js
    var doc = document;

    var docEvents = [
        doc.oncontextmenu = null,
        doc.onselectstart = null,
        doc.ondragstart = null,
        doc.onmousedown = null
    ];

    [].forEach.call(
        ['copy', 'cut', 'paste', 'select', 'selectstart'],
        function(event) {
            document.addEventListener(event, function(e) { e.stopPropagation(); }, true);
        }
    );

    window.addEventListener('contextmenu', function contextmenu(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        var handler = new eventHandler(event);
        window.removeEventListener(event.type, contextmenu, true);
        var eventsCallBack = new eventsCall(function() {});
        handler.fire();
        window.addEventListener(event.type, contextmenu, true);
        if (handler.isCanceled && (eventsCallBack.isCalled)) {
            event.preventDefault();
        }
    }, true);

    function eventsCall() {
        this.events = ['DOMAttrModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMCharacterDataModified', 'DOMSubtreeModified'];
        this.bind();
    }

    eventsCall.prototype.bind = function() {
        this.events.forEach(function (event) {
            document.addEventListener(event, this, true);
        }.bind(this));
    };

    eventsCall.prototype.handleEvent = function() {
        this.isCalled = true;
    };

    eventsCall.prototype.unbind = function() {
        this.events.forEach(function (event) {}.bind(this));
    };

    function eventHandler(event) {
        this.event = event;
        this.contextmenuEvent = this.createEvent(this.event.type);
    }

    eventHandler.prototype.createEvent = function(type) {
        var target = this.event.target;
        var event = target.ownerDocument.createEvent('MouseEvents');
        event.initMouseEvent(
            type, this.event.bubbles, this.event.cancelable,
            target.ownerDocument.defaultView, this.event.detail,
            this.event.screenX, this.event.screenY, this.event.clientX, this.event.clientY,
            this.event.ctrlKey, this.event.altKey, this.event.shiftKey, this.event.metaKey,
            this.event.button, this.event.relatedTarget
        );
        return event;
    };

    eventHandler.prototype.fire = function() {
        var target = this.event.target;
        var contextmenuHandler = function(event) {
            event.preventDefault();
        }.bind(this);
        target.dispatchEvent(this.contextmenuEvent);
        this.isCanceled = this.contextmenuEvent.defaultPrevented;
    };
}());
