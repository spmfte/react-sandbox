import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

// Dynamically import WebLinksAddon to handle potential missing module
let WebLinksAddon;
import('xterm-addon-web-links').then(module => {
  WebLinksAddon = module.WebLinksAddon;
}).catch(err => {
  console.warn('WebLinksAddon not available:', err);
});

const Terminal = () => {
  const terminalRef = useRef(null);
  const [fitAddon, setFitAddon] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#1e1e1e'
      }
    });

    const fit = new FitAddon();
    term.loadAddon(fit);

    if (WebLinksAddon) {
      term.loadAddon(new WebLinksAddon());
    }

    term.open(terminalRef.current);

    // Use requestAnimationFrame to ensure the terminal is rendered before fitting
    requestAnimationFrame(() => {
      if (fit && typeof fit.fit === 'function') {
        fit.fit();
      }
      term.focus();
    });

    setFitAddon(fit);

    const ws = new WebSocket('ws://localhost:3001');
    setSocket(ws);

    ws.onopen = () => {
      term.writeln('Connected to server');
    };

    ws.onmessage = (event) => {
      term.write(event.data);
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    return () => {
      term.dispose();
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (!fitAddon || !socket) return;

    const handleResize = () => {
      if (fitAddon && typeof fitAddon.fit === 'function') {
        fitAddon.fit();
      }

      if (socket.readyState === WebSocket.OPEN) {
        // Use terminal's dimensions if available
        const { cols, rows } = fitAddon.proposeDimensions() || { cols: 80, rows: 24 };
        socket.send(JSON.stringify({ type: 'resize', cols, rows }));
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial resize
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [fitAddon, socket]);

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
      <div ref={terminalRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
    </div>
  );
};

export default Terminal;