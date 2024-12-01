import { h } from '../../../util/jsx/pragma'
import { Location } from '../../../model/location'

interface LocationEntryProps {
  location: Location
  onEdit: (location: Location) => void
}

export function LocationEntry({ location, onEdit }: LocationEntryProps) {
  return (
    <div className="location flex items-center">
      <div className="grow flex flex-col gap-5">
        <h2
          className="cursor-pointer"
          onClick={() => {
            onEdit(location)
          }}
        >
          {location.name}
        </h2>
        <div>
          {(() => {
            const variables = {
              '--tag-bg-color': '#ffffff',
              '--tag-color': location.category.color,
              '--tag-border-color': location.category.color,
            } as React.CSSProperties

            return (
              <div className="tag category-tag" style={variables}>
                {location.category.text}
              </div>
            )
          })()}
          {location.tags.map((tag) => {
            const variables = {
              '--tag-bg-color': tag.colorbg,
              '--tag-color': tag.color,
            } as React.CSSProperties

            return (
              <div className="tag" style={variables}>
                {tag.text}
              </div>
            )
          })}
        </div>
        <span className="address">
          {location.address.street}, {location.address.zipcode}{' '}
          {location.address.city}
        </span>
      </div>
      {location.images.map((loc) => {
        return (
          <img
            className="aspect-square"
            src={loc.url}
            alt={loc.alt}
            tabIndex={-1}
          />
        )
      })}
    </div>
  )
}
