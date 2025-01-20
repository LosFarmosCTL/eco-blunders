import { h } from '../../../util/jsx/pragma'
import { Location } from '../../../../shared/model/location'
import { TagList } from '../dialogs/edit/components/tag-list'

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
              <div className="tag category-tag mr-5" style={variables}>
                {location.category.text}
              </div>
            )
          })()}
          <TagList tags={location.tags} overlay={false} onDelete={() => {}} />
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
