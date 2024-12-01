import { h, Fragment } from '../../util/jsx/pragma'
import { setCookie } from '../../util/cookies'

import './app.css'

const detailDialogHtmlURL = new URL(
  './dialogs/detail/detail.html',
  import.meta.url,
)

function logout() {
  setCookie('user', '')
  window.location.reload()
}

export async function App(user: string) {
  console.log(user)

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
        <details className="details-modal h-full">
          <summary className="flex justify-center items-center h-full list-none text-xl bold rounded-full aspect-square cursor-pointer">
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
          <div className="location flex items-center">
            <div className="grow flex flex-col gap-5">
              <h2 className="cursor-pointer">
                Major rail work at intersection Wilhelminenhofstraße /
                Edisonstraße
              </h2>
              <div>
                <div className="tag tag-red">construction</div>
                <div className="tag tag-cyan">public transport</div>
                <div className="tag tag-yellow">sidewalks</div>
              </div>
              <a
                className="address"
                href="https://www.google.com/maps/place/Edisonstraße+63,+12459+Berlin/@52.4627426,13.511848,16z"
              >
                Edisonstraße 63, 12459 Berlin
              </a>
            </div>
            <img
              className="aspect-square"
              src="/assets/wilhelminenhof-edisonstr.webp"
              alt="Construction work at Edistonstraße 63 completely blocking all traffic"
              tabIndex={-1}
            />
          </div>
          <div className="location flex items-center">
            <div className="grow flex flex-col gap-5">
              <h2 className="cursor-pointer">
                Construction site at Schöneweide station
              </h2>
              <div>
                <div className="tag tag-red">construction</div>
                <div className="tag tag-cyan">public transport</div>
              </div>
              <a
                className="address"
                href="https://www.google.com/maps/place/52°27'17.4N+13°30'42.0E/@52.4546829,13.511719,340m"
              >
                Sterndamm/Michael-Brückner-Straße, 12439 Berlin
              </a>
            </div>
            <img
              className="aspect-square"
              src="/assets/schoeneweide.webp"
              alt="Construction work at the train station S-Schöneweide blocking blocking tram transport"
              tabIndex={-1}
              id="image-test-id"
            />
          </div>
          <div className="location flex items-center gap-5">
            <div className="grow flex flex-col gap-5">
              <h2 className="cursor-pointer">
                Replacement bus service Prenzlauer Allee
              </h2>
              <div>
                <div className="tag tag-cyan">public transport</div>
              </div>
              <a
                className="address"
                href="https://www.google.de/maps/place/Prenzlauer+Allee+178,+10409+Berlin/@52.5448151,13.4244101,16z"
              >
                Prenzlauer Allee 178 / S-Prenzlauer Allee, 10409 Berlin
              </a>
            </div>
            <img
              className="aspect-square"
              src="/assets/prenzlauerallee.webp"
              alt="an image of berlin"
              tabIndex={-1}
            />
            <img
              className="aspect-square"
              src="/assets/prenzlauerallee.webp"
              alt="an image of berlin"
              tabIndex={-1}
            />
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
      </div>
    </>
  )
}
