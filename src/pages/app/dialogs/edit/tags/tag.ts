export class Tag {
  private text: string
  private color: string
  public readonly id: number
  private static tagArray: number[] = []

  constructor(text: string) {
    //remove all white spaces except for those inbetween words
    text = text.replace(/^\s+|\s+$|\s+(?=\s)/g, '')
    console.log(text)
    this.text = text
    switch (this.text) {
      case 'construction':
        this.color = 'red'
        this.id = 1
        break
      case 'bike lanes':
        this.color = 'green'
        this.id = 2
        break
      case 'public transport':
        this.color = 'cyan'
        this.id = 3
        break
      case 'park and ride':
        this.color = 'yellow'
        this.id = 4
        break
      default:
        this.color = 'black'
        this.id = 0
    }
  }

  public getTagElment(): HTMLDivElement {
    /*
        <div class="tag tag-red">
          <div class="tag-hover-overlay">
            <span class="fa-solid fa-xmark"></span>
          </div>
          construction
        </div>
    */

    const tag = document.createElement('div')
    tag.classList.add('tag', 'tag-' + this.color)
    const hoverOverlay = document.createElement('div')
    hoverOverlay.classList.add('tag-hover-overlay')
    const icon = document.createElement('span')
    icon.classList.add('fa-solid', 'fa-xmark')
    hoverOverlay.appendChild(icon)
    tag.appendChild(hoverOverlay)
    tag.appendChild(document.createTextNode(this.text))
    Tag.tagArray.push(this.id)

    icon.addEventListener('click', () => {
      tag.remove()
      Tag.tagArray.filter((value) => {
        return value !== this.id
      })
    })

    return tag
  }
}
