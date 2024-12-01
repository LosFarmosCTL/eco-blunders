type Tag = string | ((props: Props, children: Children) => HTMLElement)
type Props = Record<string, string | EventListenerOrEventListenerObject> | null
type Children = (Node | string)[]

export function h(tag: Tag, props: Props, ...children: Children): HTMLElement {
  if (typeof tag === 'function') return tag({ ...props }, children)

  const element = document.createElement(tag)
  if (props) {
    Object.entries(props).forEach(([key, val]) => {
      if (key === 'className' && typeof val === 'string') {
        const classes = (val || '').trim().split(' ')
        element.classList.add(...classes)
      } else if (key.startsWith('on')) {
        const event = key.toLowerCase().substring(2)
        const listener = val as EventListenerOrEventListenerObject
        element.addEventListener(event, listener)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        element.setAttribute(key, val.toString())
      }
    })
  }

  element.append(...children)

  return element
}

export function Fragment(_props: object, children: Children) {
  console.log(children)
  const fragment = document.createDocumentFragment()
  children.forEach((child) => {
    if (child instanceof Node) {
      fragment.appendChild(child)
    } else {
      fragment.appendChild(document.createTextNode(String(child)))
    }
  })

  return fragment
}
