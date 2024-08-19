import React, { useRef, useEffect, useState } from 'react';
import ErrorDisplay from '../../ErrorDisplay';

const OutputWindow = ({ runCode, error }) => {
  const iframeRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIframeLoaded(true);
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    if (!iframeLoaded) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    const transformedCode = runCode();
    if (!transformedCode) return;

    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          <div id="root"></div>
          <script>
            ${transformedCode}
            ReactDOM.render(React.createElement(ExampleComponent), document.getElementById('root'));
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
  }, [iframeLoaded, runCode]);

  return (
    <div className="output-container bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className="output-content h-[400px] overflow-auto">
        {error ? (
          <ErrorDisplay error={error} />
        ) : (
          <iframe
            ref={iframeRef}
            title="component-output"
            className="w-full h-full border-none"
            sandbox="allow-scripts"
          />
        )}
      </div>
    </div>
  );
};

export default OutputWindow;