import { useState, useCallback } from 'react';
import * as Babel from '@babel/standalone';

const defaultCode = `
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
`;

const useSandbox = () => {
  const [code, setCode] = useState(defaultCode);
  const [error, setError] = useState('');

  const runCode = useCallback(() => {
    try {
      setError('');
      const transformedCode = Babel.transform(code, { presets: ['react'] }).code;
      return transformedCode;
    } catch (err) {
      setError(err.toString());
      return null;
    }
  }, [code]);

  return { code, setCode, error, runCode };
};

export default useSandbox;