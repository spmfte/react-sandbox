import React from 'react';
import CodeEditor from './code-editor/CodeEditor';
import OutputWindow from './ui/output-window/OutputWindow';
import RunButton from './RunButton';
import useSandbox from '../hooks/useSandbox';
import '../styles/ComponentSandbox.css';

const ComponentSandbox = () => {
  const { code, setCode, error, runCode } = useSandbox();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">React Sandbox</h1>
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Code Editor</h2>
              <CodeEditor code={code} onChange={setCode} />
              <RunButton onClick={runCode} />
            </div>
            <div className="w-full md:w-1/2 p-6 bg-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Output</h2>
              <OutputWindow runCode={runCode} error={error} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentSandbox;