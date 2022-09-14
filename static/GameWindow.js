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
    constructor(layoutProps, _layout) {
        this._layout = _layout;
        const layoutsEntries = Object
            .entries(layoutProps)
            .map(([name, prop]) => [name, layoutFactory(prop)]);
        this.layouts = Object.fromEntries(layoutsEntries);
        this.hideExceptActive();
    }
    get layout() {
        return this._layout;
    }
    set layout(value) {
        const prev = this.layouts[this._layout];
        prev.active = false;
        this._layout = value;
        const cur = this.layouts[value];
        cur.active = true;
    }
    hideExceptActive() {
        Object.entries(this.layouts).forEach(([name, layout]) => {
            layout.active = name === this._layout;
        });
    }
}
export default new GameWindow({
    'no-game': '#window__no-game',
    'searching': '#window__searching',
    'game': ['#window__game', '#finish-game']
}, 'no-game');
