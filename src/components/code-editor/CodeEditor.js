import React from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor = ({ code, onChange }) => (
  <div className="editor-container rounded-lg overflow-hidden">
    <Editor
      height="100%"
      defaultLanguage="javascript"
      value={code}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
      }}
    />
  </div>
);

export default CodeEditor;