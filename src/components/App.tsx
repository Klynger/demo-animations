import React, { useEffect, useState } from 'react';
import Shelf from './Shelf';
import Test from './Test';

function App() {
  const [test, setTest] = useState('rafael');

  useEffect(() => {
    setTest('klynger');
  }, []);

  return (
    <div className="App">
      <Shelf />
      <Test test={test} />
    </div>
  );
}

export default App;
