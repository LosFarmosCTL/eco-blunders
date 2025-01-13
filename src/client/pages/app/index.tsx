import { h, Fragment } from '../../util/jsx/pragma'
import { setCookie } from '../../util/cookies'

import './app.css'
import { request } from '../../util/request'
import { Location } from '../../model/location'
import { LocationEntry } from './components/location-entry'
import { EditDialog } from './dialogs/edit'
import { Tag } from '../../model/tag'
import { Category } from '../../model/category'
import { TagSelector } from './dialogs/edit/components/tag-selector'
import { DetailDialog } from './dialogs/detail'
import { User, UserRole } from '../../model/user'

function logout() {
  setCookie('user', '')
  window.location.reload()
}

export async function App(user: User) {
  const tags = await request<Tag[]>('./tags.json', {})
  const categories = await request<Category[]>('./categories.json', {})
  let locations = await request<Location[]>('./locations.json', {})

  let editDialog: HTMLDialogElement | null
  let locationList: HTMLDivElement | null
  let locationEntries = new Map<string, HTMLElement>()

  function addLocation() {
    editDialog?.replaceWith(getEditDialog(null))
    editDialog?.showModal()
  }

  function editLocation(location: Location) {
    if (user.role === UserRole.admin) {
      editDialog?.replaceWith(getEditDialog(location))
      editDialog?.showModal()
    } else {
      editDialog?.replaceWith(
        <DetailDialog
          dialogRef={(dialog) => (editDialog = dialog)}
          location={location}
        />,
      )
      editDialog?.showModal()
    }
  }

  function getEditDialog(location: Location | null) {
    return (
      <EditDialog
        dialogRef={(dialog) => (editDialog = dialog)}
        tags={tags}
        categories={categories}
        location={location}
        onEdit={updateLocation}
        onDelete={deleteLocation}
      />
    )
  }

  async function updateLocation(location: Location) {
    if (locations.some((loc) => location.id == loc.id)) {
      //TODO: update location in db
      const entry = <LocationEntry location={location} onEdit={editLocation} />
      locationEntries.get(location.id)?.replaceWith(entry)
      locationEntries.set(location.id, entry)
    } else {
      //TODO: insert location in db
      const result = await request('http://localhost:3000/loc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      })
      if (!result) {
        console.error('Failed to insert location')
        alert('Failed to insert location')
        return
      }
      locations.push(location)
      const entry = <LocationEntry location={location} onEdit={editLocation} />
      locationList?.appendChild(entry)
      locationEntries.set(location.id, entry)
    }
  }

  function deleteLocation(location: Location) {
    locationEntries.get(location.id)?.remove()
    locations = locations.filter((loc) => loc.id != location.id)
  }

  return (
    <>
      <header className="app-header mb-20">
        <h1>
          <span>List of </span>ecoBlunders™
        </h1>
        <details className="details-modal h-full aspect-square">
          <summary className="flex justify-center items-center h-full list-none text-xl bold rounded-full aspect-square cursor-pointer select-none">
            {user.name.at(0)}
          </summary>
          <div className="absolute right-0 mr-5 mt-5">
            <div className="p-10">
              Hello, <span className="bold">{user.name} 👋</span>!
            </div>
            <button
              className="flex justify-between items-center p-10 w-full"
              type="reset"
              onClick={logout}
            >
              Sign out
              <span className="fa-solid fa-right-from-bracket" />
            </button>
          </div>
        </details>
      </header>
      <div className="app-content">
        <main className="flex flex-col gap-10">
          <div className="flex">
            <details className="filters details-modal">
              <summary className="list-none select-none cursor-pointer">
                Filters
                <span className="ml-5 fa-solid fa-caret-down" />
              </summary>
              <TagSelector
                ref={() => {}}
                tags={tags}
                selectedTags={[]}
                addTag={() => {}}
              />
            </details>
            <input
              className="search-bar grow"
              type="text"
              name="search"
              placeholder="Search..."
            />
            {user.role === UserRole.admin ?
              <button className="btn-positive ml-10" onClick={addLocation}>
                Add Location
              </button>
            : ''}
          </div>
          <div
            ref={(elem) => (locationList = elem)}
            className="flex flex-col gap-10"
          >
            {locations.map((loc) => {
              const entry = (
                <LocationEntry location={loc} onEdit={editLocation} />
              )
              locationEntries.set(loc.id, entry)

              return entry
            })}
          </div>
        </main>
        <footer className="footer flex justify-end">
          <ul className="flex gap-10 list-none">
            <a href="">
              <li>Privacy Policy</li>
            </a>
            <a href="">
              <li>Imprint</li>
            </a>
          </ul>
        </footer>
        <dialog ref={(dialog) => (editDialog = dialog)} />
      </div>
    </>
  )
}
