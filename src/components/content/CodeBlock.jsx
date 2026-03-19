import React, { useState, useCallback } from 'react';

/**
 * Lightweight tokenizer for Rust syntax highlighting.
 * Returns an array of { text, type } tokens.
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
    // Block comments (including nested)
    { type: 'comment', regex: /^(\/\*[\s\S]*?\*\/)/ },
    // Line comments
    { type: 'comment', regex: /^(\/\/[^\n]*)/ },
    // Attributes like #[...] and #![...]
    { type: 'attribute', regex: /^(#!?\[[^\]]*\])/ },
    // Raw strings r#"..."#
    { type: 'string', regex: /^(r#+"[^]*?"#+)/ },
    // Regular strings
    { type: 'string', regex: /^("(?:[^"\\]|\\.)*")/ },
    // Character literals
    { type: 'string', regex: /^('(?:[^'\\]|\\.)')/ },
    // Lifetimes 'a, 'b, 'static etc. (but not char literals)
    { type: 'lifetime', regex: /^('(?:static|[a-zA-Z_]\w*))\b/ },
    // Macros: word followed by !
    { type: 'macro', regex: /^([a-zA-Z_]\w*!)/ },
    // Numbers (hex, binary, octal, float, int with optional type suffix)
    { type: 'number', regex: /^(0x[0-9a-fA-F_]+|0b[01_]+|0o[0-7_]+|\d[\d_]*\.[\d_]*(?:e[+-]?\d+)?(?:f32|f64)?|\d[\d_]*(?:e[+-]?\d+)?(?:u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|f32|f64|usize|isize)?)/ },
    // Identifiers (keywords, types, or plain)
    { type: 'ident', regex: /^([a-zA-Z_]\w*)/ },
    // Operators and punctuation
    { type: 'operator', regex: /^(->|=>|::|&&|\|\||[+\-*/%=<>!&|^~:,.;?[\]{}()])/ },
    // Whitespace
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

/**
 * Lightweight tokenizer for Python syntax highlighting.
 * Returns an array of { text, type } tokens.
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

/** Token color classes for Rust syntax */
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

/** Token color classes for Python syntax */
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

const LANGUAGE_LABELS = {
  rust: 'Rust',
  python: 'Python',
  bash: 'Bash',
  toml: 'TOML',
  shell: 'Shell',
  text: 'Text',
};

/**
 * Syntax-highlighted code block supporting Rust and Python.
 *
 * Props:
 *   code      {string}   Source code string
 *   language  {string}   'rust' | 'python' | 'bash' | 'toml'
 *   title     {string}   Optional block title
 *   runnable  {bool}     Show "Try in Playground" button (links to play.rust-lang.org for Rust)
 */
function CodeBlock({ code = '', language = 'rust', title, runnable = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
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

  // Build playground URL for Rust
  const playgroundUrl = language === 'rust'
    ? `https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&code=${encodeURIComponent(code)}`
    : null;

  // Tokenize and render highlighted code
  const renderContent = () => {
    if (language === 'rust') {
      const tokens = tokenizeRust(code);
      return tokens.map((token, i) => (
        <span key={i} className={RUST_TOKEN_COLORS[token.type] || 'text-gray-200'}>
          {token.text}
        </span>
      ));
    }
    if (language === 'python') {
      const tokens = tokenizePython(code);
      return tokens.map((token, i) => (
        <span key={i} className={PYTHON_TOKEN_COLORS[token.type] || 'text-gray-200'}>
          {token.text}
        </span>
      ));
    }
    // For bash, toml, and other languages, render as plain text
    return <span className="text-gray-200">{code}</span>;
  };

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-gray-700 bg-gray-950 shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-4 py-2.5">
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          {/* Title or language */}
          <span className="text-xs font-medium text-gray-400">
            {title || LANGUAGE_LABELS[language] || language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Playground button (Rust only) */}
          {runnable && playgroundUrl && (
            <a
              href={playgroundUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border border-orange-600/50 bg-orange-900/30 px-2.5 py-1 text-xs font-medium text-orange-400 transition-colors hover:bg-orange-900/50"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 17.5v-11l8 5.5-8 5.5z"/>
              </svg>
              Try in Playground
            </a>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md border border-gray-600 bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code body */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono">{renderContent()}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;
