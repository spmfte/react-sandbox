import React, { useState, useEffect } from 'react';
import { transform } from '@babel/standalone';
import Editor from '@monaco-editor/react';
import Terminal from './Terminal';

const ReactSandbox = () => {
  const [code, setCode] = useState(`
  function ExampleComponent() {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [volume, setVolume] = React.useState(0.5);
    const audioRef = React.useRef(null);

    React.useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }, [volume]);

    const togglePlay = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    return (
      <div
        className="p-8 rounded-xl shadow-2xl max-w-md mx-auto"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        <h2
          className="text-3xl font-bold mb-6 text-white text-center"
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          Music Player
        </h2>
        <div
          className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-filter backdrop-blur-lg"
        >
          <button
            className="w-full py-3 px-6 mb-4 font-semibold rounded-full text-white transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
            style={{
              background: isPlaying
                ? 'linear-gradient(to right, #ff6b6b, #feca57)'
                : 'linear-gradient(to right, #4facfe, #00f2fe)',
              boxShadow: '0 4px 15px 0 rgba(65, 132, 234, 0.75)',
            }}
            onClick={togglePlay}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full"
            style={{
              WebkitAppearance: 'none',
              appearance: 'none',
              height: '15px',
              borderRadius: '5px',
              background: '#d3d3d3',
              outline: 'none',
              opacity: '0.7',
              transition: 'opacity .2s',
            }}
          />
        </div>
        <audio
          ref={audioRef}
          loop
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        />
        <div className="mt-6 text-center text-white text-opacity-80">
         {audioRef.current && audioRef.current.src}
        </div>
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