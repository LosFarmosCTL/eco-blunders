export class Tag {
  private text: string
  private color: string

  constructor(text: string) {
    //write a regex that filters out all leadig and trailing whitespaces
    //and all whitespaces that are not between words
    //and replace them with nothing
    text = text.replace(/^\s+|\s+$|\s+(?=\s)/g, '')
    console.log(text)
    this.text = text
    switch (this.text) {
      case 'construction':
        this.color = 'red'
        break
      case 'bike lanes':
        this.color = 'green'
        break
      case 'public transport':
        this.color = 'cyan'
        break
      case 'park and ride':
        this.color = 'yellow'
        break
      default:
        this.color = 'black'
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

    return tag
  }
}
