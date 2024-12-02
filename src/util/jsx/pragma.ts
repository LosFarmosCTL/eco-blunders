type Tag = string | ((props: Props, children: Children) => HTMLElement)
type Props = Record<
  string,
  string | EventListenerOrEventListenerObject | RefCallback
> | null
type Children = (Node | string)[]
type RefCallback = (element: HTMLElement) => void

export function h(tag: Tag, props: Props, ...children: Children): HTMLElement {
  if (typeof tag === 'function') return tag({ ...props }, children)

  const element = document.createElement(tag)
  if (props) {
    Object.entries(props).forEach(([key, val]) => {
      if (key === 'ref' && typeof val === 'function') {
        const handler = val as RefCallback
        handler(element)
      } else if (key === 'className' && typeof val === 'string') {
        const classes = (val || '').trim().split(' ')
        element.classList.add(...classes)
      } else if (key === 'style') {
        const styles = val as React.CSSProperties
        Object.entries(styles).forEach(([rule, value]) => {
          element.style.setProperty(rule, value as string)
        })
      } else if (key.startsWith('on')) {
        const event = key.toLowerCase().substring(2)
        const listener = val as EventListenerOrEventListenerObject
        element.addEventListener(event, listener)
      } else if (key === 'defaultValue') {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        element.textContent = val.toString()
      } else {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        element.setAttribute(key, val.toString())
      }
    })
  }

  element.append(...children.flat())

  return element
}

export function Fragment(_props: object, children: Children) {
  const fragment = document.createDocumentFragment()
  children.flat().forEach((child) => {
    if (child instanceof Node) {
      fragment.appendChild(child)
    } else {
      fragment.appendChild(document.createTextNode(String(child)))
    }
  })

  return fragment
}
