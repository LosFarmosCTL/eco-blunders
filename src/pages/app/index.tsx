import { h, Fragment } from '../../util/jsx/pragma'
import { setCookie } from '../../util/cookies'

import './app.css'
import { request } from '../../util/request'
import { Location } from '../../model/location'
import { LocationEntry } from './components/location-entry'
import { EditDialog } from './dialogs/edit'
import { Tag } from '../../model/tag'
import { TagSelector } from './dialogs/edit/components/tag-selector'

function logout() {
  setCookie('user', '')
  window.location.reload()
}

export async function App(user: string) {
  const locations = await request<[Location]>('/locations.json', {})
  const tags = await request<[Tag]>('/tags.json', {})

  let editDialog: HTMLDialogElement | null

  function addLocation() {
    editDialog?.replaceWith(getEditDialog(null))
    editDialog?.showModal()
  }

  function editLocation(location: Location) {
    editDialog?.replaceWith(getEditDialog(location))
    editDialog?.showModal()
  }

  function getEditDialog(location: Location | null) {
    return (
      <EditDialog
        dialogRef={(dialog) => (editDialog = dialog)}
        tags={tags}
        location={location}
        onEdit={() => console.log('edit')}
        onDelete={() => console.log('delete')}
      />
    )
  }

  return (
    <>
      <header className="app-header mb-20">
        <h1>
          <span>List of </span>ecoBlunders™
        </h1>
        <details className="details-modal h-full aspect-square">
          <summary className="flex justify-center items-center h-full list-none text-xl bold rounded-full aspect-square cursor-pointer select-none">
            {user.at(0)?.toUpperCase()}
          </summary>
          <div className="absolute right-0 mr-5 mt-5">
            <div className="p-10">
              Hello, <span className="bold">{user}</span>!
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
            <button className="btn-positive" onClick={addLocation}>
              Add Location
            </button>
          </div>
          {locations.map((loc) => {
            return <LocationEntry location={loc} onEdit={editLocation} />
          })}
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
