import { h, Fragment } from '../../../../../util/jsx/pragma'
import { Tag } from '../../../../../model/tag'

interface TagListProps {
  tags: Tag[]
  overlay: boolean
  onDelete: (tag: Tag) => void
}

export function TagList({ tags, overlay, onDelete }: TagListProps) {
  function deleteTag(tag: Tag) {
    onDelete(tag)
  }

  return (
    <>
      {tags.map((tag) => {
        const variables = {
          '--tag-bg-color': tag.colorbg,
          '--tag-color': tag.color,
        } as React.CSSProperties
        return (
          <div className="tag mr-5" style={variables}>
            {overlay ?
              <div className="tag-hover-overlay">
                <span
                  className="fa-solid fa-xmark"
                  onClick={() => deleteTag(tag)}
                />
              </div>
            : ''}
            {tag.text}
          </div>
        )
      })}
    </>
  )
}
