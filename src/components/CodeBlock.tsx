// src/components/CodeBlock.tsx
import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
// import draculaTheme from 'prism-react-renderer/themes/dracula';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeBlockProps {
  code: string;
  language: string;
}

// 自定义深色主题
const customTheme = {
  plain: {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#6a9955',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: '#d4d4d4',
      },
    },
    {
      types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol', 'deleted'],
      style: {
        color: '#9cdcfe',
      },
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: {
        color: '#c586c0',
      },
    },
    {
      types: ['operator', 'entity', 'url', 'string'],
      style: {
        color: '#d4d4d4',
      },
    },
    {
      types: ['atrule', 'attr-value', 'keyword'],
      style: {
        color: '#569cd6',
      },
    },
    {
      types: ['function', 'class-name'],
      style: {
        color: '#dcdcaa',
      },
    },
    {
      types: ['regex', 'important', 'variable'],
      style: {
        color: '#c586c0',
      },
    },
  ],
};


export const CodeBlock = ({ code, language }: CodeBlockProps) => {
  return (
    <div className="my-4 overflow-hidden rounded-lg shadow-md">
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 flex justify-between items-center">
        <span>{language}</span>
        <button className="text-gray-500 hover:text-gray-300 transition-colors">
          <i className="fa fa-copy"></i>
        </button>
      </div>
      <Highlight
        {...defaultProps}
        code={code}
        language={language}
        theme={customTheme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ ...style, padding: '1rem' }}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};