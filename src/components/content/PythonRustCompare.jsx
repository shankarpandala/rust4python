import React, { useState, useCallback } from 'react';

/**
 * Lightweight tokenizer for Python syntax highlighting.
 */
function tokenizePython(code) {
  const tokens = [];
  let remaining = code;

  const patterns = [
    { type: 'comment', regex: /^(#[^\n]*)/ },
    { type: 'string', regex: /^("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/ },
    { type: 'keyword', regex: /^(def|class|import|from|as|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|try|except|finally|with|yield|lambda|pass|break|continue|raise|del|global|nonlocal|assert|async|await)\b/ },
    { type: 'builtin', regex: /^(print|len|range|enumerate|zip|map|filter|list|dict|set|tuple|int|float|str|bool|type|isinstance|hasattr|getattr|setattr|super|property|staticmethod|classmethod|abs|max|min|sum|sorted|reversed|open|input|vars|dir|repr|format|round|id|hash|iter|next|any|all|callable)\b/ },
    { type: 'decorator', regex: /^(@\w+)/ },
    { type: 'number', regex: /^(\b\d+\.?\d*(?:[eE][+-]?\d+)?\b)/ },
    { type: 'function', regex: /^(\w+)(?=\s*\()/ },
    { type: 'plain', regex: /^([\w.]+)/ },
    { type: 'operator', regex: /^([+\-*/%=<>!&|^~:,.[\]{}()])/ },
    { type: 'whitespace', regex: /^(\s+)/ },
  ];

  while (remaining.length > 0) {
    let matched = false;
    for (const { type, regex } of patterns) {
      const m = remaining.match(regex);
      if (m) {
        tokens.push({ text: m[1], type });
        remaining = remaining.slice(m[1].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: remaining[0], type: 'plain' });
      remaining = remaining.slice(1);
    }
  }
  return tokens;
}

/**
 * Lightweight tokenizer for Rust syntax highlighting.
 */
function tokenizeRust(code) {
  const tokens = [];
  let remaining = code;

  const KEYWORDS = new Set([
    'fn', 'let', 'mut', 'if', 'else', 'match', 'for', 'while', 'loop', 'in',
    'return', 'struct', 'enum', 'impl', 'trait', 'pub', 'mod', 'use', 'crate',
    'self', 'super', 'where', 'async', 'await', 'move', 'ref', 'type', 'const',
    'static', 'unsafe', 'dyn', 'extern', 'as', 'break', 'continue', 'true', 'false',
  ]);

  const TYPES = new Set([
    'i8', 'i16', 'i32', 'i64', 'i128', 'u8', 'u16', 'u32', 'u64', 'u128',
    'f32', 'f64', 'bool', 'char', 'str', 'String', 'Vec', 'HashMap', 'HashSet',
    'Option', 'Result', 'Box', 'Rc', 'Arc', 'Cell', 'RefCell', 'Mutex',
  ]);

  const patterns = [
    { type: 'comment', regex: /^(\/\*[\s\S]*?\*\/)/ },
    { type: 'comment', regex: /^(\/\/[^\n]*)/ },
    { type: 'attribute', regex: /^(#!?\[[^\]]*\])/ },
    { type: 'string', regex: /^(r#+"[^]*?"#+)/ },
    { type: 'string', regex: /^("(?:[^"\\]|\\.)*")/ },
    { type: 'string', regex: /^('(?:[^'\\]|\\.)')/ },
    { type: 'lifetime', regex: /^('(?:static|[a-zA-Z_]\w*))\b/ },
    { type: 'macro', regex: /^([a-zA-Z_]\w*!)/ },
    { type: 'number', regex: /^(0x[0-9a-fA-F_]+|0b[01_]+|0o[0-7_]+|\d[\d_]*\.[\d_]*(?:e[+-]?\d+)?(?:f32|f64)?|\d[\d_]*(?:e[+-]?\d+)?(?:u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|f32|f64|usize|isize)?)/ },
    { type: 'ident', regex: /^([a-zA-Z_]\w*)/ },
    { type: 'operator', regex: /^(->|=>|::|&&|\|\||[+\-*/%=<>!&|^~:,.;?[\]{}()])/ },
    { type: 'whitespace', regex: /^(\s+)/ },
  ];

  while (remaining.length > 0) {
    let matched = false;
    for (const { type, regex } of patterns) {
      const m = remaining.match(regex);
      if (m) {
        let tokenType = type;
        if (type === 'ident') {
          if (KEYWORDS.has(m[1])) {
            tokenType = 'keyword';
          } else if (TYPES.has(m[1])) {
            tokenType = 'type';
          } else {
            tokenType = 'plain';
          }
        }
        tokens.push({ text: m[1], type: tokenType });
        remaining = remaining.slice(m[1].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: remaining[0], type: 'plain' });
      remaining = remaining.slice(1);
    }
  }
  return tokens;
}

const PYTHON_TOKEN_COLORS = {
  comment: 'text-gray-500',
  string: 'text-green-400',
  keyword: 'text-purple-400 font-semibold',
  builtin: 'text-yellow-300',
  decorator: 'text-yellow-500',
  number: 'text-orange-400',
  function: 'text-blue-300',
  operator: 'text-gray-400',
  whitespace: '',
  plain: 'text-gray-200',
};

const RUST_TOKEN_COLORS = {
  keyword: 'text-purple-400 font-semibold',
  type: 'text-cyan-400',
  macro: 'text-yellow-300',
  lifetime: 'text-pink-400',
  string: 'text-green-400',
  comment: 'text-gray-500',
  number: 'text-orange-400',
  attribute: 'text-yellow-500',
  operator: 'text-gray-400',
  whitespace: '',
  plain: 'text-gray-200',
};

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 rounded-md border border-gray-600 bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700"
      aria-label="Copy code"
    >
      {copied ? (
        <span className="text-green-400">Copied!</span>
      ) : (
        <>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

/**
 * Side-by-side Python vs Rust code comparison component.
 *
 * Props:
 *   pythonCode  {string}  Python source code
 *   rustCode    {string}  Rust source code
 *   title       {string}  Comparison title
 *   description {string}  Optional description text
 */
function PythonRustCompare({ pythonCode = '', rustCode = '', title, description }) {
  const renderPython = () => {
    const tokens = tokenizePython(pythonCode);
    return tokens.map((token, i) => (
      <span key={i} className={PYTHON_TOKEN_COLORS[token.type] || 'text-gray-200'}>
        {token.text}
      </span>
    ));
  };

  const renderRust = () => {
    const tokens = tokenizeRust(rustCode);
    return tokens.map((token, i) => (
      <span key={i} className={RUST_TOKEN_COLORS[token.type] || 'text-gray-200'}>
        {token.text}
      </span>
    ));
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-gray-700 bg-gray-950 shadow-lg">
      {/* Title bar */}
      {(title || description) && (
        <div className="border-b border-gray-700 bg-gray-900 px-4 py-3">
          {title && (
            <h4 className="text-sm font-semibold text-gray-200">{title}</h4>
          )}
          {description && (
            <p className="mt-1 text-xs text-gray-400 leading-relaxed">{description}</p>
          )}
        </div>
      )}

      {/* Side-by-side panels */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Python side */}
        <div className="border-b border-gray-700 md:border-b-0 md:border-r">
          {/* Python header */}
          <div className="flex items-center justify-between border-b border-gray-700 bg-[#3776AB]/15 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs font-semibold text-[#4B8BBE]">Python</span>
            </div>
            <CopyButton code={pythonCode} />
          </div>
          {/* Python code */}
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
            <code className="font-mono">{renderPython()}</code>
          </pre>
        </div>

        {/* Rust side */}
        <div>
          {/* Rust header */}
          <div className="flex items-center justify-between border-b border-gray-700 bg-orange-500/10 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs font-semibold text-orange-400">Rust</span>
            </div>
            <CopyButton code={rustCode} />
          </div>
          {/* Rust code */}
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
            <code className="font-mono">{renderRust()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default PythonRustCompare;
