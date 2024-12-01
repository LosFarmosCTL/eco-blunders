type Tag = string | ((props: Props, children: Children) => HTMLElement)
type Props = Record<string, string> | null
type Children = (Node | string)[]

export function h(tag: Tag, props: Props, ...children: Children): HTMLElement {
  if (typeof tag === 'function') return tag({ ...props }, children)

  const element = document.createElement(tag)
  if (props) {
    Object.entries(props).forEach(([key, val]) => {
      if (key === 'className') {
        element.classList.add(...(val || '').trim().split(' '))
        return
      }

      element.setAttribute(key, val)
    })
  }

  children.forEach((child) => {
    element.append(child)
  })

  return element
}

export const Fragment = () => null
