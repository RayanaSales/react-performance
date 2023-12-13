// Code splitting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

/**
 * This lazy mode will only renders the default component from the file - and must be a component.
 *
 * The coolest thing about it, is that the user can start interacting with the app earlier
 * and dont need to wait everything to be loaded before being able to interact
 */
const Globe = React.lazy(() => import(/* webpackPrefetch: true */ '../globe'))
/**
 * THE webpackPrefetch MAGIC COMMENT 
 * 
 * Suppose that you are using webpack, and you are pretty sure the user is going to click on 
 * certain button. So, you wanna pre-load it before the user actually click it. So you can 
 * use the webpackPrefetch magic comment.
 * 
 * This will tell to the browser: "I want you to load all the link modules <Link /> required 
 * to load this module”. This way the browser will do it as soon he is not busy anymore.
 */

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
      }}
    >
      <label style={{marginBottom: '1rem'}}>
        <input
          type="checkbox"
          checked={showGlobe}
          onChange={e => setShowGlobe(e.target.checked)}
        />
        {' show globe'}
      </label>
      <div style={{width: 400, height: 400}}>
        <React.Suspense fallback={<div>loading...</div>}>
          {showGlobe ? <Globe /> : null}
        </React.Suspense>
      </div>
    </div>
  )
}

export default App
