import React, { useState, useEffect } from 'react';
import { transform } from '@babel/standalone';
import Editor from '@monaco-editor/react';
import Terminal from '../Terminal';

const ReactSandbox = () => {
  const [code, setCode] = useState(`
function ExampleComponent() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg shadow-lg max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Example Component</h2>
      <p className="text-lg text-white mb-4">You clicked {count} times</p>
      <button
        className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors duration-200"
        onClick={() => setCount(count + 1)}
      >
        Click me
      </button>
    </div>
  );
}
  `);
  const [error, setError] = useState(null);
  const [CompiledComponent, setCompiledComponent] = useState(null);

  useEffect(() => {
    const compileCode = () => {
      try {
        const transformedCode = transform(code, {
          presets: ['react'],
          filename: 'example.js',
        }).code;

        // eslint-disable-next-line no-new-func
        const ComponentFunction = new Function('React', `
          ${transformedCode}
          return ExampleComponent;
        `);

        const CompiledComponent = ComponentFunction(React);
        setCompiledComponent(() => CompiledComponent);
        setError(null);
      } catch (err) {
        console.error('Compilation error:', err);
        setError(err.toString());
        setCompiledComponent(null);
      }
    };

    const debounce = setTimeout(compileCode, 1000);
    return () => clearTimeout(debounce);
  }, [code]);

  return (
    <div className="flex h-screen">
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/2 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Code Editor</h2>
          </div>
          <div className="flex-grow" style={{ minHeight: '500px' }}>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={setCode}
              theme="vs-dark"
              options={{ 
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Terminal</h3>
            <Terminal />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4 bg-gray-100 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
          <div className="border border-gray-300 rounded-lg p-4 flex-grow overflow-auto bg-white">
            <style dangerouslySetInnerHTML={{__html: `
              @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
            `}} />
            {error ? (
              <div className="text-red-500 whitespace-pre-wrap">{error}</div>
            ) : CompiledComponent ? (
              <CompiledComponent />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactSandbox;