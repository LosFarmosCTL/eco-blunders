import { h, Fragment } from '../../util/jsx/pragma'
import { setCookie } from '../../util/cookies'

import './app.css'
import { request } from '../../util/request'
import { Location } from '../../model/location'
import { LocationEntry } from './components/location-entry'

const detailDialogHtmlURL = new URL(
  './dialogs/detail/detail.html',
  import.meta.url,
)

function logout() {
  setCookie('user', '')
  window.location.reload()
}

export async function App(user: string) {
  const locations = await request<[Location]>('/locations.json', {})

  const { EditDialog } = await import('./dialogs/edit')
  const editDialog = new EditDialog()

  // TODO: extract to separate class as well
  await import('./dialogs/detail/detail.css')
  const detailDialog = document.createElement('dialog')
  const detailDialogHTML = await (await fetch(detailDialogHtmlURL)).text()
  detailDialog.innerHTML = detailDialogHTML
  detailDialog.id = 'detail-dialog'
  document.body.appendChild(detailDialog)

  async function addLocation() {
    await editDialog.load(null)
    console.log(await editDialog.showModal())

    // TODO: load+store input data
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
              <div className="tag-selector">
                <h3>Filter by tag</h3>
                <div className="tag-selector-search">
                  <input
                    type="text"
                    name="tag-search"
                    placeholder="Search for tag"
                  />
                </div>
                <div className="tag-selector-tag">
                  <span className="tag-red" /> construction
                </div>
                <div className="tag-selector-tag">
                  <span className="tag-green" /> bike lanes
                </div>
                <div className="tag-selector-tag">
                  <span className="tag-cyan" /> public transport
                </div>
                <div className="tag-selector-tag">
                  <span className="tag-yellow" /> park and ride
                </div>
              </div>
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
            return (
              <LocationEntry
                location={loc}
                onEdit={(location) => {
                  console.log(location)
                }}
              />
            )
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
      </div>
    </>
  )
}
