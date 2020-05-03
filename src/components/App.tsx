import React, { useState } from 'react'

import Shelf from './Shelf'

function App() {
  const [show, setShow] = useState(false)

  const handleClick = () => {
    setShow(!show)
  }

  return (
    <div className="App">
      <Shelf show={show} />
      <button onClick={handleClick}>Toggle</button>
    </div>
  )
}

export default App
