"use strict";
function find(query) {
    const element = document.querySelector(query);
    if (!element) {
        throw new Error(`Element "${query}" not found.`);
    }
    return element;
}
function layoutFactory(layoutProp) {
    if (layoutProp instanceof Array) {
        return new CompositeLayout(layoutProp);
    }
    return new SimpleLayout(layoutProp);
}
class CompositeLayout {
    constructor(props) {
        this.elements = props.map(prop => {
            if (typeof prop === 'string')
                return find(prop);
            return prop;
        });
        this._active = this.elements.some(prop => {
            return !prop.classList.contains('closed');
        });
    }
    get active() {
        return this._active;
    }
    set active(value) {
        this._active = value;
        this.elements.forEach(element => {
            if (value)
                element.classList.remove('closed');
            else
                element.classList.add('closed');
        });
    }
}
class SimpleLayout {
    constructor(prop) {
        this.element = typeof prop === 'string'
            ? find(prop)
            : prop;
        this._active = !this.element.classList.contains('closed');
    }
    get active() {
        return this._active;
    }
    set active(value) {
        this._active = value;
        if (value)
            this.element.classList.remove('closed');
        else
            this.element.classList.add('closed');
    }
}
// GAME WINDOW
class GameWindow {
    constructor(layouts, _currentLayout) {
        this.layouts = layouts;
        this._currentLayout = _currentLayout;
        Object.entries(layouts).forEach(([layoutName, layout]) => {
            layout.active = layoutName === _currentLayout;
        });
    }
    get layout() {
        return this._currentLayout;
    }
    set layout(value) {
        const prev = this.layouts[this._currentLayout];
        prev.active = false;
        this._currentLayout = value;
        const cur = this.layouts[value];
        cur.active = true;
    }
}
// GAME WINDOW BUILDER
