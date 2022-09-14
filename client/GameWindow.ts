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

class GameWindow<T extends {[layoutName: string]: Layout}> {

  constructor(
    private readonly layouts: T,
    private _currentLayout: keyof T,
  ) {
    Object.entries(layouts).forEach(([layoutName, layout]) => {
      layout.active = layoutName === _currentLayout
    })
  }

  get layout() {
    return this._currentLayout
  }

  set layout(value: keyof T) {
    const prev = this.layouts[this._currentLayout]
    prev.active = false
    this._currentLayout = value
    const cur = this.layouts[value]
    cur.active = true
  }

}

// GAME WINDOW BUILDER