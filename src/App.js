import React from 'react';
import Start from './components/Start';
import Quiz from './components/Quiz';
import Result from './components/Result';
import { DataProvider } from './context/dataContext';

function App() {
  const block = (e) => e.preventDefault();

  return (
    <DataProvider>
      <div onCopy={block} onCut={block} onContextMenu={block}>
        {/* Welcome Page */}
        <Start />

        {/* Quiz Page */}
        <Quiz />

        {/* Result Page */}
        <Result />
      </div>
    </DataProvider>
  );
}

export default App;
