import { h } from '../../../../../util/jsx/pragma'
import { Tag } from '../../../../../../shared/model/tag'

interface TagSelectorProps {
  ref: (elem: HTMLElement) => void
  tags: Tag[]
  selectedTags: Tag[]
  addTag: (tag: Tag) => void
}

export function TagSelector({
  ref,
  tags,
  selectedTags,
  addTag,
}: TagSelectorProps) {
  const element = (
    <div className="tag-selector">
      <h3>Edit tags</h3>
      <div className="tag-selector-search">
        <input name="tag-search" placeholder="Search for tag" />
      </div>
      {tags.map((tag) => {
        const selected = selectedTags.some((t) => t.id == tag.id)
        const variables = {
          '--tag-bg-color': tag.colorbg,
        } as React.CSSProperties
        return (
          <div
            className={
              'tag-selector-tag ' +
              (!selected ? 'cursor-pointer' : 'tag-selected')
            }
            onClick={() => {
              if (!selected) addTag(tag)
            }}
          >
            <span className="tag-color" style={variables} /> {tag.text}
            {selected ?
              <span className="fa-solid fa-check ml-5" />
            : ''}
          </div>
        )
      })}
    </div>
  )

  ref(element)
  return element
}
