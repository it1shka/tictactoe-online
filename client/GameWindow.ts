function find(query: string) {
  const element = document.querySelector(query)
  if(!element) {
    throw new Error(`Element "${query}" not found.`)
  }
  return element
}

// LAYOUT

interface Layout {
  active: boolean
}

type LayoutFactoryProp = 
  | string
  | Element
  | Array<string | Element>

function layoutFactory(layoutProp: LayoutFactoryProp): Layout {
  if(layoutProp instanceof Array) {
    return new CompositeLayout(layoutProp)
  }
  return new SimpleLayout(layoutProp)
}

class CompositeLayout implements Layout {

  private readonly elements: Element[]
  private _active: boolean

  constructor(props: Array<string | Element>) {
    this.elements = props.map(prop => {
      if(typeof prop === 'string') return find(prop)
      return prop
    })
    this._active = this.elements.some(prop => {
      return !prop.classList.contains('closed')
    })
  }

  get active() {
    return this._active
  }

  set active(value: boolean) {
    this._active = value
    this.elements.forEach(element => {
      if(value) element.classList.remove('closed')
      else element.classList.add('closed')
    })
  }

}

class SimpleLayout implements Layout {

  private readonly element: Element
  private _active: boolean

  constructor(prop: string | Element) {
    this.element = typeof prop === 'string'
      ? find(prop)
      : prop
    this._active = !this.element.classList.contains('closed')
  }

  get active() {
    return this._active
  }

  set active(value: boolean) {
    this._active = value
    if(value) this.element.classList.remove('closed')
    else this.element.classList.add('closed')
  }

}

// GAME WINDOW

class GameWindow<T extends string, D extends T> {

  private readonly layouts: {[name in T]: Layout}
  private _layout: T

  constructor(
    layoutProps: {[name in T]: LayoutFactoryProp},
    _layout: D
  ){
    this._layout = _layout
    const layoutsEntries = Object
      .entries<LayoutFactoryProp>(layoutProps)
      .map(([name, prop]) => [name, layoutFactory(prop)])
    this.layouts = Object.fromEntries(layoutsEntries)
    this.hideExceptActive()
  }

  get layout() {
    return this._layout
  }

  set layout(value: T) {
    const prev = this.layouts[this._layout]
    prev.active = false
    this._layout = value
    const cur = this.layouts[value]
    cur.active = true
  }

  private hideExceptActive() {
    Object.entries<Layout>(this.layouts).forEach(([name, layout]) => {
      layout.active = name === this._layout 
    })
  }

}

export default new GameWindow({
  'no-game': '#window__no-game',
  'searching': '#window__searching',
  'game': ['#window__game', '#finish-game']
}, 'no-game')

