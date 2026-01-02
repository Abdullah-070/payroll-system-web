import React from 'react';

export default function Footer() {
  return (
    <>
      <style jsx>{`
        .footer-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #0f0f1e;
          border-top: 2px solid #00d4ff;
          padding: 12px 20px;
          text-align: center;
          font-size: 13px;
          color: #aaa;
          z-index: 9999;
          width: 100%;
          box-sizing: border-box;
          user-select: none;
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .footer-container a {
          color: #00d4ff;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .footer-container a:hover {
          color: #00ff88;
        }

        .github-icon {
          width: 16px;
          height: 16px;
          display: inline-block;
        }

        body {
          padding-bottom: 50px !important;
        }
      `}</style>

      <div className="footer-container" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0f0f1e',
        borderTop: '2px solid #00d4ff',
        padding: '12px 20px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#aaa',
        zIndex: 9999,
        width: '100%',
        boxSizing: 'border-box',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}>
        <span>© 2025 Employee Payroll System |</span>
        <a
          href="https://github.com/Abdullah-070"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#00d4ff',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            style={{ display: 'inline' }}
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Made by Abdullah
        </a>
      </div>
    </>
  );
}
