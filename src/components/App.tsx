import React, { useState, useLayoutEffect } from 'react'

import Shelf from './Shelf'

function App() {
  const [show, setShow] = useState(false)

  useLayoutEffect(() => {
    if (!show) {
      setShow(true)
    }
  }, [show])

  const handleClick = () => {
    setShow(false)
  }

  return (
    <div className="App">
      {show && <Shelf />}
      <button onClick={handleClick}>Refresh</button>
    </div>
  )
}

export default App
