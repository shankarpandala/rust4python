import{r as y,j as e}from"./vendor-Dh_dlHsl.js";function j(i){const s=[];let t=i;const o=new Set(["fn","let","mut","if","else","match","for","while","loop","in","return","struct","enum","impl","trait","pub","mod","use","crate","self","super","where","async","await","move","ref","type","const","static","unsafe","dyn","extern","as","break","continue","true","false"]),l=new Set(["i8","i16","i32","i64","i128","u8","u16","u32","u64","u128","f32","f64","bool","char","str","String","Vec","HashMap","HashSet","Option","Result","Box","Rc","Arc","Cell","RefCell","Mutex"]),u=[{type:"comment",regex:/^(\/\*[\s\S]*?\*\/)/},{type:"comment",regex:/^(\/\/[^\n]*)/},{type:"attribute",regex:/^(#!?\[[^\]]*\])/},{type:"string",regex:/^(r#+"[^]*?"#+)/},{type:"string",regex:/^("(?:[^"\\]|\\.)*")/},{type:"string",regex:/^('(?:[^'\\]|\\.)')/},{type:"lifetime",regex:/^('(?:static|[a-zA-Z_]\w*))\b/},{type:"macro",regex:/^([a-zA-Z_]\w*!)/},{type:"number",regex:/^(0x[0-9a-fA-F_]+|0b[01_]+|0o[0-7_]+|\d[\d_]*\.[\d_]*(?:e[+-]?\d+)?(?:f32|f64)?|\d[\d_]*(?:e[+-]?\d+)?(?:u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|f32|f64|usize|isize)?)/},{type:"ident",regex:/^([a-zA-Z_]\w*)/},{type:"operator",regex:/^(->|=>|::|&&|\|\||[+\-*/%=<>!&|^~:,.;?[\]{}()])/},{type:"whitespace",regex:/^(\s+)/}];for(;t.length>0;){let h=!1;for(const{type:c,regex:g}of u){const d=t.match(g);if(d){let p=c;c==="ident"&&(o.has(d[1])?p="keyword":l.has(d[1])?p="type":p="plain"),s.push({text:d[1],type:p}),t=t.slice(d[1].length),h=!0;break}}h||(s.push({text:t[0],type:"plain"}),t=t.slice(1))}return s}function k(i){const s=[];let t=i;const o=[{type:"comment",regex:/^(#[^\n]*)/},{type:"string",regex:/^("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/},{type:"keyword",regex:/^(def|class|import|from|as|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|try|except|finally|with|yield|lambda|pass|break|continue|raise|del|global|nonlocal|assert|async|await)\b/},{type:"builtin",regex:/^(print|len|range|enumerate|zip|map|filter|list|dict|set|tuple|int|float|str|bool|type|isinstance|hasattr|getattr|setattr|super|property|staticmethod|classmethod|abs|max|min|sum|sorted|reversed|open|input|vars|dir|repr|format|round|id|hash|iter|next|any|all|callable)\b/},{type:"decorator",regex:/^(@\w+)/},{type:"number",regex:/^(\b\d+\.?\d*(?:[eE][+-]?\d+)?\b)/},{type:"function",regex:/^(\w+)(?=\s*\()/},{type:"plain",regex:/^([\w.]+)/},{type:"operator",regex:/^([+\-*/%=<>!&|^~:,.[\]{}()])/},{type:"whitespace",regex:/^(\s+)/}];for(;t.length>0;){let l=!1;for(const{type:u,regex:h}of o){const c=t.match(h);if(c){s.push({text:c[1],type:u}),t=t.slice(c[1].length),l=!0;break}}l||(s.push({text:t[0],type:"plain"}),t=t.slice(1))}return s}const _={keyword:"text-purple-400 font-semibold",type:"text-cyan-400",macro:"text-yellow-300",lifetime:"text-pink-400",string:"text-green-400",comment:"text-gray-500",number:"text-orange-400",attribute:"text-yellow-500",operator:"text-gray-400",whitespace:"",plain:"text-gray-200"},R={comment:"text-gray-500",string:"text-green-400",keyword:"text-purple-400 font-semibold",builtin:"text-yellow-300",decorator:"text-yellow-500",number:"text-orange-400",function:"text-blue-300",operator:"text-gray-400",whitespace:"",plain:"text-gray-200"},C={rust:"Rust",python:"Python",bash:"Bash",toml:"TOML",shell:"Shell",text:"Text"};function n({code:i="",language:s="rust",title:t,runnable:o=!1}){const[l,u]=y.useState(!1),h=y.useCallback(async()=>{try{await navigator.clipboard.writeText(i),u(!0),setTimeout(()=>u(!1),2e3)}catch{const d=document.createElement("textarea");d.value=i,document.body.appendChild(d),d.select(),document.execCommand("copy"),document.body.removeChild(d),u(!0),setTimeout(()=>u(!1),2e3)}},[i]),c=s==="rust"?`https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&code=${encodeURIComponent(i)}`:null,g=()=>s==="rust"?j(i).map((p,x)=>e.jsx("span",{className:_[p.type]||"text-gray-200",children:p.text},x)):s==="python"?k(i).map((p,x)=>e.jsx("span",{className:R[p.type]||"text-gray-200",children:p.text},x)):e.jsx("span",{className:"text-gray-200",children:i});return e.jsxs("div",{className:"my-5 overflow-hidden rounded-xl border border-gray-700 bg-gray-950 shadow-lg",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-gray-700 bg-gray-900 px-4 py-2.5",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("div",{className:"flex gap-1.5",children:[e.jsx("div",{className:"h-3 w-3 rounded-full bg-red-500/70"}),e.jsx("div",{className:"h-3 w-3 rounded-full bg-yellow-500/70"}),e.jsx("div",{className:"h-3 w-3 rounded-full bg-green-500/70"})]}),e.jsx("span",{className:"text-xs font-medium text-gray-400",children:t||C[s]||s})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[o&&c&&e.jsxs("a",{href:c,target:"_blank",rel:"noopener noreferrer",className:"flex items-center gap-1.5 rounded-md border border-orange-600/50 bg-orange-900/30 px-2.5 py-1 text-xs font-medium text-orange-400 transition-colors hover:bg-orange-900/50",children:[e.jsx("svg",{className:"h-3.5 w-3.5",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 17.5v-11l8 5.5-8 5.5z"})}),"Try in Playground"]}),e.jsx("button",{onClick:h,className:"flex items-center gap-1.5 rounded-md border border-gray-600 bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700","aria-label":"Copy code",children:l?e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"h-3.5 w-3.5 text-green-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}),e.jsx("span",{className:"text-green-400",children:"Copied!"})]}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"h-3.5 w-3.5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"})}),"Copy"]})})]})]}),e.jsx("pre",{className:"overflow-x-auto p-4 text-sm leading-relaxed",children:e.jsx("code",{className:"font-mono",children:g()})})]})}function m({title:i,children:s}){return e.jsxs("div",{className:"my-6 overflow-hidden rounded-xl border-2 border-cyan-400/50 bg-cyan-50/50 shadow-sm dark:border-cyan-500/40 dark:bg-cyan-950/20",children:[e.jsxs("div",{className:"flex items-center gap-3 border-b border-cyan-400/30 bg-cyan-100/60 px-5 py-3 dark:border-cyan-500/30 dark:bg-cyan-900/30",children:[e.jsx("div",{className:"flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white dark:bg-cyan-600",children:e.jsx("svg",{className:"h-4 w-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"})})}),e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400",children:"Concept"}),i&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"text-cyan-400 dark:text-cyan-600",children:"·"}),e.jsx("span",{className:"text-sm font-semibold text-cyan-800 dark:text-cyan-200",children:i})]})]}),e.jsx("div",{className:"px-5 py-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:s})]})}const b={note:{icon:e.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),label:"Note",border:"border-blue-400/50 dark:border-blue-500/40",bg:"bg-blue-50/60 dark:bg-blue-950/20",headerBg:"bg-blue-100/60 dark:bg-blue-900/30",headerBorder:"border-blue-400/30 dark:border-blue-500/30",iconColor:"text-blue-500 dark:text-blue-400",labelColor:"text-blue-600 dark:text-blue-400"},pythonista:{icon:e.jsx("svg",{className:"h-5 w-5",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-.16l-.06-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"})}),label:"Python Developer's Note",border:"border-[#3776AB]/50 dark:border-[#4B8BBE]/40",bg:"bg-blue-50/60 dark:bg-[#1a2744]/40",headerBg:"bg-[#3776AB]/10 dark:bg-[#3776AB]/20",headerBorder:"border-[#3776AB]/30 dark:border-[#4B8BBE]/30",iconColor:"text-[#3776AB] dark:text-[#4B8BBE]",labelColor:"text-[#3776AB] dark:text-[#4B8BBE]"},tip:{icon:e.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"})}),label:"Tip",border:"border-teal-400/50 dark:border-teal-500/40",bg:"bg-teal-50/60 dark:bg-teal-950/20",headerBg:"bg-teal-100/60 dark:bg-teal-900/30",headerBorder:"border-teal-400/30 dark:border-teal-500/30",iconColor:"text-teal-500 dark:text-teal-400",labelColor:"text-teal-600 dark:text-teal-400"},warning:{icon:e.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"})}),label:"Warning",border:"border-amber-400/50 dark:border-amber-500/40",bg:"bg-amber-50/60 dark:bg-amber-950/20",headerBg:"bg-amber-100/60 dark:bg-amber-900/30",headerBorder:"border-amber-400/30 dark:border-amber-500/30",iconColor:"text-amber-500 dark:text-amber-400",labelColor:"text-amber-600 dark:text-amber-400"}};function r({title:i,children:s,type:t="note"}){const o=b[t]||b.note,l=i||o.label;return e.jsxs("div",{className:`my-5 overflow-hidden rounded-xl border-2 shadow-sm ${o.border} ${o.bg}`,children:[e.jsxs("div",{className:`flex items-center gap-2 border-b px-4 py-2.5 ${o.headerBg} ${o.headerBorder}`,children:[e.jsx("span",{className:o.iconColor,children:o.icon}),e.jsx("span",{className:`text-xs font-semibold uppercase tracking-wider ${o.labelColor}`,children:l})]}),e.jsx("div",{className:"px-5 py-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:s})]})}const v={beginner:{label:"Beginner",badgeClass:"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",dotClass:"bg-green-500"},intermediate:{label:"Intermediate",badgeClass:"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",dotClass:"bg-yellow-500"},advanced:{label:"Advanced",badgeClass:"bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",dotClass:"bg-orange-500"},research:{label:"Research",badgeClass:"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",dotClass:"bg-red-500"}};function f({title:i="Exercise",problem:s,solution:t,difficulty:o="intermediate"}){const[l,u]=y.useState(!1),h=v[o]||v.intermediate;return e.jsxs("div",{className:"my-8 overflow-hidden rounded-xl border-2 border-orange-300/60 bg-white shadow-sm dark:border-orange-600/40 dark:bg-gray-900/30",children:[e.jsxs("div",{className:"flex items-center gap-3 border-b border-orange-200 bg-orange-50/80 px-5 py-3 dark:border-orange-700/40 dark:bg-orange-900/20",children:[e.jsx("svg",{className:"h-5 w-5 text-orange-600 dark:text-orange-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"})}),e.jsx("h3",{className:"text-sm font-bold text-orange-700 dark:text-orange-300 flex-1",children:i}),e.jsx("span",{className:`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${h.badgeClass}`,children:h.label})]}),e.jsx("div",{className:"px-5 py-4 border-b border-orange-100 dark:border-orange-800/30",children:e.jsx("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap",children:s})}),t&&e.jsxs("div",{className:"px-5 py-3",children:[e.jsxs("button",{onClick:()=>u(c=>!c),className:"flex items-center gap-1.5 rounded-md border border-orange-300/50 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 transition-colors hover:bg-orange-100 dark:border-orange-600/30 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30","aria-expanded":l,children:[e.jsx("svg",{className:`h-3.5 w-3.5 transition-transform duration-200 ${l?"rotate-90":"rotate-0"}`,fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})}),l?"Hide Solution":"Reveal Solution"]}),l&&e.jsx("div",{className:"mt-3 overflow-x-auto rounded-lg border border-orange-200 bg-orange-50/60 dark:border-orange-700/40 dark:bg-orange-900/15",children:e.jsx("pre",{className:"p-4 text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap",children:t})})]})]})}function P(i){const s=[];let t=i;const o=[{type:"comment",regex:/^(#[^\n]*)/},{type:"string",regex:/^("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/},{type:"keyword",regex:/^(def|class|import|from|as|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|try|except|finally|with|yield|lambda|pass|break|continue|raise|del|global|nonlocal|assert|async|await)\b/},{type:"builtin",regex:/^(print|len|range|enumerate|zip|map|filter|list|dict|set|tuple|int|float|str|bool|type|isinstance|hasattr|getattr|setattr|super|property|staticmethod|classmethod|abs|max|min|sum|sorted|reversed|open|input|vars|dir|repr|format|round|id|hash|iter|next|any|all|callable)\b/},{type:"decorator",regex:/^(@\w+)/},{type:"number",regex:/^(\b\d+\.?\d*(?:[eE][+-]?\d+)?\b)/},{type:"function",regex:/^(\w+)(?=\s*\()/},{type:"plain",regex:/^([\w.]+)/},{type:"operator",regex:/^([+\-*/%=<>!&|^~:,.[\]{}()])/},{type:"whitespace",regex:/^(\s+)/}];for(;t.length>0;){let l=!1;for(const{type:u,regex:h}of o){const c=t.match(h);if(c){s.push({text:c[1],type:u}),t=t.slice(c[1].length),l=!0;break}}l||(s.push({text:t[0],type:"plain"}),t=t.slice(1))}return s}function S(i){const s=[];let t=i;const o=new Set(["fn","let","mut","if","else","match","for","while","loop","in","return","struct","enum","impl","trait","pub","mod","use","crate","self","super","where","async","await","move","ref","type","const","static","unsafe","dyn","extern","as","break","continue","true","false"]),l=new Set(["i8","i16","i32","i64","i128","u8","u16","u32","u64","u128","f32","f64","bool","char","str","String","Vec","HashMap","HashSet","Option","Result","Box","Rc","Arc","Cell","RefCell","Mutex"]),u=[{type:"comment",regex:/^(\/\*[\s\S]*?\*\/)/},{type:"comment",regex:/^(\/\/[^\n]*)/},{type:"attribute",regex:/^(#!?\[[^\]]*\])/},{type:"string",regex:/^(r#+"[^]*?"#+)/},{type:"string",regex:/^("(?:[^"\\]|\\.)*")/},{type:"string",regex:/^('(?:[^'\\]|\\.)')/},{type:"lifetime",regex:/^('(?:static|[a-zA-Z_]\w*))\b/},{type:"macro",regex:/^([a-zA-Z_]\w*!)/},{type:"number",regex:/^(0x[0-9a-fA-F_]+|0b[01_]+|0o[0-7_]+|\d[\d_]*\.[\d_]*(?:e[+-]?\d+)?(?:f32|f64)?|\d[\d_]*(?:e[+-]?\d+)?(?:u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|f32|f64|usize|isize)?)/},{type:"ident",regex:/^([a-zA-Z_]\w*)/},{type:"operator",regex:/^(->|=>|::|&&|\|\||[+\-*/%=<>!&|^~:,.;?[\]{}()])/},{type:"whitespace",regex:/^(\s+)/}];for(;t.length>0;){let h=!1;for(const{type:c,regex:g}of u){const d=t.match(g);if(d){let p=c;c==="ident"&&(o.has(d[1])?p="keyword":l.has(d[1])?p="type":p="plain"),s.push({text:d[1],type:p}),t=t.slice(d[1].length),h=!0;break}}h||(s.push({text:t[0],type:"plain"}),t=t.slice(1))}return s}const T={comment:"text-gray-500",string:"text-green-400",keyword:"text-purple-400 font-semibold",builtin:"text-yellow-300",decorator:"text-yellow-500",number:"text-orange-400",function:"text-blue-300",operator:"text-gray-400",whitespace:"",plain:"text-gray-200"},N={keyword:"text-purple-400 font-semibold",type:"text-cyan-400",macro:"text-yellow-300",lifetime:"text-pink-400",string:"text-green-400",comment:"text-gray-500",number:"text-orange-400",attribute:"text-yellow-500",operator:"text-gray-400",whitespace:"",plain:"text-gray-200"};function w({code:i}){const[s,t]=y.useState(!1),o=y.useCallback(async()=>{try{await navigator.clipboard.writeText(i),t(!0),setTimeout(()=>t(!1),2e3)}catch{const l=document.createElement("textarea");l.value=i,document.body.appendChild(l),l.select(),document.execCommand("copy"),document.body.removeChild(l),t(!0),setTimeout(()=>t(!1),2e3)}},[i]);return e.jsx("button",{onClick:o,className:"flex items-center gap-1 rounded-md border border-gray-600 bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700","aria-label":"Copy code",children:s?e.jsx("span",{className:"text-green-400",children:"Copied!"}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"h-3 w-3",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"})}),"Copy"]})})}function a({pythonCode:i="",rustCode:s="",title:t,description:o}){const l=()=>P(i).map((c,g)=>e.jsx("span",{className:T[c.type]||"text-gray-200",children:c.text},g)),u=()=>S(s).map((c,g)=>e.jsx("span",{className:N[c.type]||"text-gray-200",children:c.text},g));return e.jsxs("div",{className:"my-6 overflow-hidden rounded-xl border border-gray-700 bg-gray-950 shadow-lg",children:[(t||o)&&e.jsxs("div",{className:"border-b border-gray-700 bg-gray-900 px-4 py-3",children:[t&&e.jsx("h4",{className:"text-sm font-semibold text-gray-200",children:t}),o&&e.jsx("p",{className:"mt-1 text-xs text-gray-400 leading-relaxed",children:o})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2",children:[e.jsxs("div",{className:"border-b border-gray-700 md:border-b-0 md:border-r",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-gray-700 bg-[#3776AB]/15 px-4 py-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("div",{className:"flex gap-1.5",children:[e.jsx("div",{className:"h-2.5 w-2.5 rounded-full bg-red-500/70"}),e.jsx("div",{className:"h-2.5 w-2.5 rounded-full bg-yellow-500/70"}),e.jsx("div",{className:"h-2.5 w-2.5 rounded-full bg-green-500/70"})]}),e.jsx("span",{className:"text-xs font-semibold text-[#4B8BBE]",children:"Python"})]}),e.jsx(w,{code:i})]}),e.jsx("pre",{className:"overflow-x-auto p-4 text-sm leading-relaxed",children:e.jsx("code",{className:"font-mono",children:l()})})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-gray-700 bg-orange-500/10 px-4 py-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("div",{className:"flex gap-1.5",children:[e.jsx("div",{className:"h-2.5 w-2.5 rounded-full bg-red-500/70"}),e.jsx("div",{className:"h-2.5 w-2.5 rounded-full bg-yellow-500/70"}),e.jsx("div",{className:"h-2.5 w-2.5 rounded-full bg-green-500/70"})]}),e.jsx("span",{className:"text-xs font-semibold text-orange-400",children:"Rust"})]}),e.jsx(w,{code:s})]}),e.jsx("pre",{className:"overflow-x-auto p-4 text-sm leading-relaxed",children:e.jsx("code",{className:"font-mono",children:u()})})]})]})]})}function E(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Why Rust Matters for DS/ML/AI"}),e.jsx("p",{children:"If you work in data science, machine learning, or AI, you already rely on Rust every day — you just might not know it. The tools rewriting Python's infrastructure are overwhelmingly choosing Rust: Polars, Ruff, tokenizers, tiktoken, uv, and many more. Understanding Rust unlocks the ability to contribute to these projects, build your own high-performance extensions, and reason about why your Python code is fast (or slow)."}),e.jsxs(m,{title:"The Performance Gap",children:[e.jsxs("p",{children:["Python is an interpreted language with a Global Interpreter Lock (GIL) and garbage collector. Rust compiles to native machine code with zero-cost abstractions and no runtime overhead. In practice, this means Rust code typically runs ",e.jsx("strong",{children:"10-100x faster"})," than equivalent Python for CPU-bound tasks — and uses a fraction of the memory."]}),e.jsx("p",{children:"This isn't just a benchmark curiosity. When you're tokenizing a 100GB text corpus, training a model on millions of records, or serving inference at scale, that performance gap is the difference between minutes and hours, between one server and fifty."})]}),e.jsx("h2",{children:"Real-World Rust in the Python Ecosystem"}),e.jsx("p",{children:"These are not hypothetical projects — they are tools you likely already use:"}),e.jsx(n,{language:"python",title:"Tools you use that are written in Rust",code:`# Polars — DataFrame library, 10-100x faster than pandas
import polars as pl
df = pl.read_csv("huge_dataset.csv")
result = df.group_by("category").agg(pl.col("value").mean())

# Ruff — Python linter/formatter, 100x faster than flake8
# $ ruff check . --fix

# tiktoken — OpenAI's tokenizer for GPT models
import tiktoken
enc = tiktoken.encoding_for_model("gpt-4")
tokens = enc.encode("Hello, world!")

# tokenizers — Hugging Face fast tokenizers
from tokenizers import Tokenizer
tokenizer = Tokenizer.from_pretrained("bert-base-uncased")

# uv — Python package installer, 10-100x faster than pip
# $ uv pip install numpy pandas scikit-learn`}),e.jsxs(r,{type:"pythonista",title:"You're already benefiting from Rust",children:["Every time you use Polars instead of pandas, run Ruff instead of flake8, or tokenize text with tiktoken, you're running Rust under the hood. Learning Rust lets you understand ",e.jsx("em",{children:"why"})," these tools are fast and how to build your own."]}),e.jsx("h2",{children:"Performance: Not Just Faster — Fundamentally Different"}),e.jsx(a,{title:"Summing 10 million numbers",description:"A simple benchmark showing the raw performance difference. Rust's compiled, zero-overhead approach eliminates interpreter overhead entirely.",pythonCode:`# Python: ~0.5 seconds
total = sum(range(10_000_000))
print(total)

# Even with NumPy (~0.02s), you're
# calling into C, not Python
import numpy as np
total = np.sum(np.arange(10_000_000))`,rustCode:`// Rust: ~0.01 seconds (release mode)
fn main() {
    let total: i64 = (0..10_000_000).sum();
    println!("{}", total);
}

// No external library needed —
// the standard iterator is already
// compiled to optimal machine code.`}),e.jsx("h2",{children:"Memory Safety Without a Garbage Collector"}),e.jsx("p",{children:"Python uses reference counting plus a cycle-detecting garbage collector to manage memory. This works well for most code, but introduces unpredictable pauses and makes memory usage hard to control. Rust takes a radically different approach: the compiler tracks ownership of every value and inserts deallocation at compile time. There is no garbage collector at runtime."}),e.jsx(n,{language:"rust",title:"Rust's ownership system manages memory at compile time",code:`fn process_data() {
    // 'data' is allocated here
    let data = vec![1, 2, 3, 4, 5];

    // 'data' is moved into the function — no copy
    let result = analyze(data);

    // Can't use 'data' here — the compiler prevents it!
    // println!("{:?}", data); // ERROR: value used after move

    println!("Result: {}", result);
} // 'result' is dropped (freed) here — deterministic, no GC

fn analyze(numbers: Vec<i32>) -> f64 {
    let sum: i32 = numbers.iter().sum();
    sum as f64 / numbers.len() as f64
} // 'numbers' is freed here — automatically, predictably`}),e.jsx(r,{type:"note",title:"No GC pauses in production",children:"In ML serving and real-time systems, garbage collector pauses can cause latency spikes. Rust eliminates this entire class of problems. Memory is freed deterministically when values go out of scope — no pause, no unpredictability."}),e.jsx("h2",{children:"When Is Rust Worth the Learning Curve?"}),e.jsx("p",{children:"Rust has a steeper learning curve than Python. It is worth investing in when:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Performance-critical code:"})," Data preprocessing pipelines, tokenizers, custom model layers, serving infrastructure."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Python extensions:"})," Writing native modules with PyO3 to replace slow inner loops."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Systems you deploy:"})," CLI tools, microservices, WebAssembly modules where Python's startup time or memory usage is a problem."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Correctness matters:"})," The compiler catches entire classes of bugs — null pointer dereferences, data races, use-after-free — at compile time."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Contributing to the ecosystem:"})," Polars, tokenizers, Ruff, and similar projects accept contributions from Rust developers."]})]}),e.jsx("h2",{children:"ML/AI Infrastructure Is Moving to Rust"}),e.jsx(n,{language:"python",title:"The Rust-powered AI/ML stack",code:`# The modern Python AI stack increasingly depends on Rust:

# Data loading & processing
import polars as pl          # Rust-powered DataFrames
from tokenizers import *     # Rust-powered tokenization
import tiktoken              # Rust-powered BPE tokenizer

# Development tools
# ruff                       # Rust-powered linting
# uv                         # Rust-powered package management
# maturin                    # Build Rust-Python packages

# Inference & serving
# candle                     # Rust ML framework (Hugging Face)
# burn                       # Rust deep learning framework
# ort (ONNX Runtime)         # Rust bindings for inference`}),e.jsx(r,{type:"tip",title:"You don't have to replace Python",children:"The goal is not to rewrite all your Python in Rust. The most effective pattern is to keep Python for high-level orchestration, prototyping, and glue code, while using Rust for the performance-critical inner loops. This is exactly what Polars, tiktoken, and tokenizers do — Rust core, Python API."}),e.jsx("h2",{children:"What You'll Learn in This Course"}),e.jsx("p",{children:"This course teaches Rust through the lens of what you already know from Python. Every concept is introduced with a Python comparison so you can map new ideas onto familiar ones. By the end, you will be able to:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Read and write Rust confidently"}),e.jsx("li",{children:"Build Python extensions with PyO3"}),e.jsx("li",{children:"Understand ownership, borrowing, and lifetimes"}),e.jsx("li",{children:"Work with Rust's type system, error handling, and concurrency"}),e.jsx("li",{children:"Build high-performance data processing tools"})]}),e.jsx(f,{title:"Reflection: Your Rust Use Cases",difficulty:"beginner",problem:`Think about your current Python projects. Identify:

1. Which Python tools you use that are built on Rust (check the list above).
2. One bottleneck in your workflow where a 10-100x speedup would matter.
3. A task where you've hit Python's performance ceiling (e.g., slow loops, high memory usage, GIL limitations).

Write down your answers — they'll motivate your learning throughout this course.

Bonus: Run this in your terminal to see if you already have any Rust tools installed:
  which ruff && ruff --version
  which uv && uv --version`,solution:`Common answers from Python DS/ML developers:

1. Rust-backed tools: Polars, Ruff, tiktoken, tokenizers, uv, cryptography, orjson
2. Common bottlenecks: data preprocessing, text tokenization, feature engineering on large datasets, serving model inference at low latency
3. Python ceilings: CPU-bound loops over millions of rows, real-time inference serving, processing large text corpora, memory-intensive operations on big datasets

These are exactly the scenarios where Rust shines — and where learning Rust will pay off most.`})]})}const q=Object.freeze(Object.defineProperty({__proto__:null,default:E},Symbol.toStringTag,{value:"Module"}));function I(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Rust vs Python Mental Model"}),e.jsxs("p",{children:["Moving from Python to Rust is not just about learning new syntax — it requires a fundamental shift in how you think about code. Python lets you focus on",e.jsx("em",{children:"what"})," your program does. Rust forces you to also think about ",e.jsx("em",{children:"how"})," it does it: where values live in memory, who owns them, and when they are freed. This section maps out the key mental shifts so you know what to expect."]}),e.jsxs(m,{title:"The Six Key Mental Shifts",children:[e.jsxs("p",{children:["Every difference between Rust and Python stems from a core design philosophy: Rust chooses ",e.jsx("strong",{children:"compile-time guarantees"})," over runtime convenience. This means the compiler does more work so your program does less. The result is faster, safer code — but you pay for it with a stricter authoring experience."]}),e.jsxs("ol",{children:[e.jsx("li",{children:"Compiled vs interpreted"}),e.jsx("li",{children:"Static vs dynamic typing"}),e.jsx("li",{children:"Ownership vs reference counting"}),e.jsx("li",{children:"No null, no exceptions — Option and Result instead"}),e.jsx("li",{children:"Explicit vs implicit"}),e.jsx("li",{children:"Zero-cost abstractions"})]})]}),e.jsx("h2",{children:"1. Compiled vs Interpreted"}),e.jsxs("p",{children:["Python reads and executes your code line by line at runtime. Rust compiles your entire program to native machine code ",e.jsx("em",{children:"before"})," it runs. This means Rust catches many bugs at compile time that Python would only reveal when the buggy line actually executes."]}),e.jsx(a,{title:"When errors are caught",description:"Python discovers this bug only when the function is called. Rust catches it before the program ever runs.",pythonCode:`def greet(name):
    # Python doesn't check types at all —
    # this function happily accepts anything
    return "Hello, " + name

# This works fine
print(greet("Alice"))

# This crashes at RUNTIME
print(greet(42))
# TypeError: can only concatenate
# str to str, not "int"`,rustCode:`fn greet(name: &str) -> String {
    format!("Hello, {}", name)
}

fn main() {
    // This works fine
    println!("{}", greet("Alice"));

    // This fails at COMPILE TIME
    // println!("{}", greet(42));
    // error: expected '&str', found
    // integer
}`}),e.jsx(r,{type:"pythonista",title:"Think of it as type-checking on steroids",children:"If you use mypy or pyright in strict mode, you have a taste of what Rust's compiler does. But Rust goes much further — it also checks memory safety, thread safety, and lifetime validity, all at compile time."}),e.jsx("h2",{children:"2. Static vs Dynamic Typing"}),e.jsx("p",{children:"In Python, variables do not have types — values do. A variable can hold a string one moment and an integer the next. In Rust, every variable has a fixed type determined at compile time. The compiler often infers the type, so you do not always need to write it out, but it is always known."}),e.jsx(a,{title:"Variable types",description:"Python variables can change type freely. Rust variables have a single, fixed type.",pythonCode:`# Python: variables are just labels
x = 42        # x points to an int
x = "hello"   # now x points to a str
x = [1, 2, 3] # now x points to a list

# Type is checked at runtime, if at all
def double(n):
    return n * 2

double(5)       # 10
double("hi")    # "hihi"
double([1, 2])  # [1, 2, 1, 2]`,rustCode:`fn main() {
    // Rust: variables have fixed types
    let x: i32 = 42;
    // x = "hello"; // ERROR: expected
    //              // i32, found &str

    // Type inference — compiler figures
    // it out
    let y = 42;    // inferred as i32
    let z = "hi";  // inferred as &str

    // Functions require explicit types
    fn double(n: i32) -> i32 {
        n * 2
    }
    println!("{}", double(5)); // 10
}`}),e.jsx("h2",{children:"3. Ownership vs Reference Counting"}),e.jsxs("p",{children:["This is the biggest mental shift. In Python, values are reference-counted: multiple variables can point to the same object, and it is freed when the last reference goes away. In Rust, every value has exactly one ",e.jsx("strong",{children:"owner"}),". When the owner goes out of scope, the value is freed. You can lend access through",e.jsx("strong",{children:"references"})," (&), but the owner remains in control."]}),e.jsx(n,{language:"rust",title:"Ownership: values have exactly one owner",code:`fn main() {
    let data = vec![1, 2, 3]; // 'data' owns this vector

    let other = data;         // Ownership MOVES to 'other'

    // println!("{:?}", data); // ERROR: 'data' no longer owns it
    println!("{:?}", other);   // OK: 'other' is the owner now

    // Borrowing: lend access without giving up ownership
    let data2 = vec![4, 5, 6];
    print_vec(&data2);          // Borrow with &
    println!("{:?}", data2);    // Still valid — we only lent it
}

fn print_vec(v: &Vec<i32>) {
    println!("{:?}", v);
}`}),e.jsx(r,{type:"pythonista",title:"Python equivalent intuition",children:`Imagine if Python's garbage collector were replaced by a rule: every object has exactly one variable that "owns" it. You can pass references around, but only the owner can destroy it. That is Rust's ownership model. It sounds restrictive, but it eliminates use-after-free bugs, double frees, and data races — entire classes of bugs that don't even exist in Rust.`}),e.jsx("h2",{children:"4. No Null, No Exceptions"}),e.jsxs("p",{children:["Python uses ",e.jsx("code",{children:"None"})," for absent values and exceptions for errors. Both are invisible in function signatures — you cannot tell from a function's type whether it might return ",e.jsx("code",{children:"None"})," or raise an exception. Rust replaces these with ",e.jsx("code",{children:"Option<T>"})," and ",e.jsx("code",{children:"Result<T, E>"}),", which are explicit in the type signature and ",e.jsx("em",{children:"must"})," be handled."]}),e.jsx(a,{title:"Handling absence and errors",description:"Python's None and exceptions are implicit. Rust's Option and Result are explicit in the type system.",pythonCode:`# Python: None is implicit — nothing
# in the signature warns you
def find_user(id: int):
    if id == 1:
        return {"name": "Alice"}
    return None  # surprise!

user = find_user(2)
# Forgetting to check for None:
print(user["name"])  # RUNTIME crash
# TypeError: 'NoneType' not subscriptable

# Exceptions are also invisible
def parse_int(s: str) -> int:
    return int(s)  # might raise ValueError`,rustCode:`// Rust: the type tells you it might
// be absent
fn find_user(id: u32) -> Option<String> {
    if id == 1 {
        Some("Alice".to_string())
    } else {
        None
    }
}

fn main() {
    // You MUST handle the Option
    match find_user(2) {
        Some(name) => println!("{}", name),
        None => println!("Not found"),
    }

    // Result for operations that can fail
    let n: Result<i32, _> = "42".parse();
    // Must handle the Result too
}`}),e.jsx("h2",{children:"5. Explicit vs Implicit"}),e.jsxs("p",{children:["Python embraces implicit behavior: duck typing, automatic type coercion, implicit returns of ",e.jsx("code",{children:"None"}),". Rust demands explicitness: type conversions must be explicit, there is no truthy/falsy coercion, and you must handle every possible case."]}),e.jsx(n,{language:"rust",title:"Rust requires explicit conversions",code:`fn main() {
    let x: i32 = 42;
    // let y: f64 = x;     // ERROR: no implicit conversion
    let y: f64 = x as f64; // OK: explicit cast

    let a: i32 = 100;
    let b: i64 = 200;
    // let c = a + b;          // ERROR: can't add different types
    let c = a as i64 + b;      // OK: explicit widening

    // No truthy/falsy
    let name = "hello";
    // if name { }             // ERROR: expected bool
    if !name.is_empty() { }    // OK: explicit bool check

    let count = 0;
    // if count { }            // ERROR: expected bool
    if count != 0 { }          // OK: explicit comparison
}`}),e.jsxs(r,{type:"tip",title:"Explicitness prevents bugs",children:["While Python's implicit behavior feels convenient, it is a common source of subtle bugs (e.g., ",e.jsx("code",{children:"if my_list:"})," behaving differently for empty lists vs ",e.jsx("code",{children:"None"}),"). Rust's explicitness means less guessing and fewer surprises."]}),e.jsx("h2",{children:"6. Zero-Cost Abstractions"}),e.jsx("p",{children:"In Python, abstractions have runtime cost: classes, decorators, generators all add overhead. Rust's abstractions — generics, traits, iterators — are resolved at compile time and produce code as fast as hand-written low-level code. You do not pay a performance penalty for writing clean, high-level Rust."}),e.jsx(n,{language:"rust",title:"Zero-cost iterators compile to optimal machine code",code:`fn main() {
    // This high-level iterator chain...
    let sum: i32 = (0..1000)
        .filter(|x| x % 2 == 0)
        .map(|x| x * x)
        .sum();

    // ...compiles to the SAME machine code as this manual loop:
    let mut sum2: i32 = 0;
    let mut i = 0;
    while i < 1000 {
        if i % 2 == 0 {
            sum2 += i * i;
        }
        i += 1;
    }

    assert_eq!(sum, sum2);
    println!("Sum of even squares: {}", sum);
}`}),e.jsx(r,{type:"note",title:"What 'zero-cost' really means",children:`Bjarne Stroustrup's principle: "What you don't use, you don't pay for. What you do use, you couldn't hand-code any better." Rust's generics are monomorphized (specialized for each type at compile time), iterators are inlined, and trait dispatch is static by default. The abstraction disappears completely in the compiled binary.`}),e.jsx(f,{title:"Mental Model Mapping",difficulty:"beginner",problem:'For each Python concept below, identify the Rust equivalent and the key difference:\n\n1. `None` return value\n2. `try/except` block\n3. `x = 42; x = "hello"` (reassigning to a different type)\n4. `def add(a, b): return a + b` (no type annotations)\n5. `del my_list` (manual memory management)\n6. `if my_list:` (truthy check)\n\nFor each one, explain: what would you write in Rust instead, and why does Rust do it differently?',solution:`1. None → Option<T>. Rust makes absence explicit in the type system so the compiler forces you to handle it.

2. try/except → Result<T, E> with match or the ? operator. Errors are values, not control flow — they appear in function signatures and must be handled.

3. Reassigning to different type → Not allowed. Variables have a fixed type. Use shadowing (\`let x = 42; let x = "hello";\`) to redeclare with a new type.

4. No type annotations → fn add(a: i32, b: i32) -> i32. Function signatures always require types so the compiler (and readers) know exactly what goes in and out.

5. del → Automatic. When a variable goes out of scope, its value is dropped. You never manually free memory, but it's freed deterministically (not by a GC).

6. Truthy check → if !my_list.is_empty(). Rust has no implicit bool conversion. You must write an explicit boolean expression.

The common theme: Rust shifts complexity from runtime to compile time. You write more explicit code, but the compiler catches more bugs.`})]})}const D=Object.freeze(Object.defineProperty({__proto__:null,default:I},Symbol.toStringTag,{value:"Module"}));function O(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Setting Up Rust"}),e.jsxs("p",{children:["Getting Rust installed and ready to use is straightforward. The Rust ecosystem centers around two tools: ",e.jsx("strong",{children:"rustup"})," (the toolchain manager, similar to pyenv) and ",e.jsx("strong",{children:"cargo"})," (the build system and package manager, similar to pip + poetry + pytest combined). This section walks you through installation, project creation, and IDE setup."]}),e.jsxs(m,{title:"The Rust Toolchain",children:[e.jsx("p",{children:"Rust's toolchain has three core pieces:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"rustup"})," — manages Rust versions and components (like pyenv for Python)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"rustc"})," — the Rust compiler (like python itself, but compiles to native code)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"cargo"})," — builds projects, manages dependencies, runs tests, and more (like pip + poetry + pytest + setuptools combined)"]})]}),e.jsx("p",{children:"Unlike Python, where you juggle pip, poetry, venv, pyproject.toml, and setup.py, Rust has a single official tool for everything: Cargo."})]}),e.jsx("h2",{children:"Installing Rust with rustup"}),e.jsx("p",{children:"The recommended way to install Rust is through rustup, which manages your Rust installation and makes it easy to switch between stable, beta, and nightly versions."}),e.jsx(n,{language:"bash",title:"Install Rust (macOS, Linux, WSL)",code:`# Install rustup (the Rust toolchain manager)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Follow the prompts — the defaults are fine
# Then restart your shell or run:
source $HOME/.cargo/env

# Verify the installation
rustc --version    # e.g., rustc 1.80.0
cargo --version    # e.g., cargo 1.80.0
rustup --version   # e.g., rustup 1.27.1`}),e.jsxs(r,{type:"pythonista",title:"rustup is like pyenv + pip combined",children:["Just as ",e.jsx("code",{children:"pyenv install 3.12"})," installs a Python version,",e.jsx("code",{children:"rustup install stable"})," installs the latest stable Rust. But unlike Python, you rarely need to manage multiple Rust versions — the stable release every 6 weeks is almost always what you want."]}),e.jsx(n,{language:"bash",title:"Useful rustup commands",code:`# Update to the latest Rust
rustup update

# Show installed toolchains
rustup show

# Install a specific version
rustup install 1.79.0

# Add components (like clippy for linting)
rustup component add clippy
rustup component add rustfmt`}),e.jsx("h2",{children:"Cargo Basics"}),e.jsx("p",{children:"Cargo is the heart of Rust development. It handles project creation, building, testing, dependency management, and publishing — everything that takes multiple tools in Python."}),e.jsx(n,{language:"bash",title:"Essential cargo commands",code:`# Create a new project
cargo new my_project        # creates a binary (executable) project
cargo new my_lib --lib      # creates a library project

# Build and run
cargo build                 # compile (debug mode, fast compile)
cargo build --release       # compile (release mode, optimized)
cargo run                   # build and run
cargo run --release         # build optimized and run

# Testing and quality
cargo test                  # run all tests
cargo clippy                # run the linter (like ruff/flake8)
cargo fmt                   # format code (like black/ruff format)

# Dependencies
cargo add serde             # add a dependency (like pip install)
cargo update                # update dependencies`}),e.jsx(a,{title:"Project commands comparison",description:"Cargo unifies what takes multiple tools in Python.",pythonCode:`# Python: multiple tools for different tasks

# Create project structure
# (no standard tool — manual or cookiecutter)
mkdir my_project && cd my_project

# Install dependencies
pip install numpy
poetry add numpy
uv pip install numpy

# Run code
python main.py

# Test
pytest

# Lint and format
ruff check .
ruff format .
# or: black . && flake8 .

# Build a package
python -m build`,rustCode:`# Rust: cargo does everything

# Create project structure
cargo new my_project

# Install dependencies
cargo add serde

# Run code
cargo run

# Test
cargo test

# Lint and format
cargo clippy
cargo fmt

# Build
cargo build --release`}),e.jsx("h2",{children:"Cargo.toml — Your Project Configuration"}),e.jsxs("p",{children:["Every Rust project has a ",e.jsx("code",{children:"Cargo.toml"})," file at its root. This is Rust's equivalent of ",e.jsx("code",{children:"pyproject.toml"})," — it defines your project metadata, dependencies, and build settings."]}),e.jsx(a,{title:"Project configuration files",description:"Cargo.toml serves the same role as pyproject.toml but with a more standardized format.",pythonCode:`# pyproject.toml
[project]
name = "my-project"
version = "0.1.0"
description = "My Python project"
requires-python = ">=3.10"

[project.dependencies]
numpy = ">=1.24"
pandas = ">=2.0"
requests = ">=2.31"

[tool.pytest.ini_options]
testpaths = ["tests"]

[tool.ruff]
line-length = 88`,rustCode:`# Cargo.toml
[package]
name = "my-project"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
reqwest = "0.12"

# Optional: dev dependencies (like pytest)
[dev-dependencies]
criterion = "0.5"  # benchmarking

# Optional: build profile settings
[profile.release]
opt-level = 3`}),e.jsxs(r,{type:"note",title:"Cargo.lock is like requirements.txt",children:["When you build, Cargo creates a ",e.jsx("code",{children:"Cargo.lock"})," file that pins exact dependency versions — similar to ",e.jsx("code",{children:"poetry.lock"})," or",e.jsx("code",{children:"pip freeze > requirements.txt"}),". For applications, commit the lock file. For libraries, don't."]}),e.jsx("h2",{children:"IDE Setup: VS Code + rust-analyzer"}),e.jsxs("p",{children:["The best development experience for Rust is VS Code with the",e.jsx("strong",{children:"rust-analyzer"})," extension. It provides real-time type checking, inline type hints, go-to-definition, auto-completion, and error highlighting that rivals the best Python IDE experiences."]}),e.jsx(n,{language:"bash",title:"Setting up VS Code for Rust",code:`# Install the rust-analyzer extension
# In VS Code: Ctrl+Shift+X (Cmd+Shift+X on Mac)
# Search for "rust-analyzer" and install it

# Recommended additional extensions:
# - "Even Better TOML" — syntax highlighting for Cargo.toml
# - "Error Lens" — inline error messages
# - "CodeLLDB" — debugger for Rust

# Useful VS Code settings for Rust (settings.json):
# {
#   "rust-analyzer.check.command": "clippy",
#   "rust-analyzer.inlayHints.parameterHints.enable": true,
#   "rust-analyzer.inlayHints.typeHints.enable": true
# }`}),e.jsx(r,{type:"tip",title:"rust-analyzer is your best friend",children:"Unlike Python, where IDE support is limited by dynamic typing, Rust's static type system means rust-analyzer can provide extremely accurate completions, refactoring, and error detection. It will show you types inline, catch errors as you type, and suggest fixes. Lean on it heavily while learning."}),e.jsx("h2",{children:"Your First Project"}),e.jsx(n,{language:"bash",title:"Creating and running your first Rust project",code:`# Create a new project
cargo new hello_rust
cd hello_rust

# Look at the project structure
tree .
# .
# ├── Cargo.toml
# └── src
#     └── main.rs

# The generated main.rs already has Hello World:
# fn main() {
#     println!("Hello, world!");
# }

# Build and run it
cargo run
# Compiling hello_rust v0.1.0
# Running \`target/debug/hello_rust\`
# Hello, world!`}),e.jsx(n,{language:"rust",title:"Modify src/main.rs to try something more interesting",code:`fn main() {
    let name = "Pythonista";
    let languages = vec!["Python", "Rust"];

    println!("Hello, {}!", name);
    println!("I'm learning: {:?}", languages);

    for (i, lang) in languages.iter().enumerate() {
        println!("  {}. {}", i + 1, lang);
    }

    let sum: i32 = (1..=100).sum();
    println!("Sum of 1 to 100: {}", sum);
}`}),e.jsx(f,{title:"Set Up Your Rust Environment",difficulty:"beginner",problem:"Complete these steps to verify your Rust environment is working:\n\n1. Install Rust using rustup (if not already installed).\n2. Run `rustc --version` and `cargo --version` to confirm installation.\n3. Create a new project with `cargo new rust_playground`.\n4. Modify `src/main.rs` to print your name and the current year.\n5. Run it with `cargo run`.\n6. Run `cargo clippy` and `cargo fmt` to check linting and formatting.\n7. Bonus: Open the project in VS Code with rust-analyzer and observe the inline type hints.\n\nPaste the output of `cargo run` to confirm everything works.",solution:`After installation and project creation:

\`\`\`rust
// src/main.rs
fn main() {
    let name = "Your Name";
    let year = 2025;
    println!("Hello, I'm {} and it's {}!", name, year);
    println!("I'm learning Rust to supercharge my Python projects.");
}
\`\`\`

Expected output of \`cargo run\`:
\`\`\`
   Compiling rust_playground v0.1.0 (/path/to/rust_playground)
    Finished dev [unoptimized + debuginfo] target(s) in 0.50s
     Running \`target/debug/rust_playground\`
Hello, I'm Your Name and it's 2025!
I'm learning Rust to supercharge my Python projects.
\`\`\`

\`cargo clippy\` should report no warnings.
\`cargo fmt\` should make no changes (the default template is already formatted).

If you see these results, your Rust environment is fully set up and ready to go.`})]})}const Y=Object.freeze(Object.defineProperty({__proto__:null,default:O},Symbol.toStringTag,{value:"Module"}));function z(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Hello World & Cargo"}),e.jsxs("p",{children:["Every language journey starts with Hello World, but in Rust this simple program reveals several important concepts: the ",e.jsx("code",{children:"fn main()"})," entry point, the ",e.jsx("code",{children:"println!"})," macro, and the Cargo build system. Let's compare each with its Python equivalent so you can start building mental bridges."]}),e.jsx(m,{title:"The Entry Point",children:e.jsxs("p",{children:["In Python, any ",e.jsx("code",{children:".py"})," file can be run directly — there is no required entry point. The ",e.jsx("code",{children:'if __name__ == "__main__"'})," pattern is a convention, not a requirement. In Rust, every executable must have a ",e.jsx("code",{children:"fn main()"}),"function. This is the only entry point — the compiler looks for it and refuses to build without it."]})}),e.jsx(a,{title:"Hello World",description:"The simplest possible program in both languages.",pythonCode:`# Python: just write code at the top level
print("Hello, world!")

# Or with the conventional entry point:
def main():
    print("Hello, world!")

if __name__ == "__main__":
    main()`,rustCode:`// Rust: must have fn main()
fn main() {
    println!("Hello, world!");
}

// fn — declares a function
// main — the required entry point
// println! — a macro (note the !)
// that prints to stdout`}),e.jsxs(r,{type:"pythonista",title:"Why the exclamation mark in println!?",children:["The ",e.jsx("code",{children:"!"})," means ",e.jsx("code",{children:"println!"})," is a ",e.jsx("strong",{children:"macro"}),", not a regular function. Macros can do things functions cannot — like accepting a variable number of arguments with format placeholders. Think of it like Python's f-strings built into the print call: ",e.jsxs("code",{children:['println!("x = ',"{","}",'", x)']})," is similar to ",e.jsxs("code",{children:['print(f"x = ',"{","x","}",'")']}),"."]}),e.jsx("h2",{children:"Printing and Formatting"}),e.jsx(a,{title:"String formatting",description:"Rust's format strings are similar to Python's str.format() method, using {} as placeholders.",pythonCode:`name = "Alice"
age = 30
pi = 3.14159

# f-strings (most common)
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Pi: {pi:.2f}")

# .format() method
print("Hello, {}!".format(name))

# Debug representation
data = [1, 2, 3]
print(f"Debug: {data!r}")
print(f"Data: {data}")`,rustCode:`fn main() {
    let name = "Alice";
    let age = 30;
    let pi = 3.14159_f64;

    // {} placeholders (like .format())
    println!("Name: {}", name);
    println!("Age: {}", age);
    println!("Pi: {:.2}", pi);

    // Named parameters
    println!("Hello, {name}!");

    // Debug printing with {:?}
    let data = vec![1, 2, 3];
    println!("Debug: {:?}", data);
    // Pretty-print with {:#?}
    println!("Pretty: {:#?}", data);
}`}),e.jsx(n,{language:"rust",title:"Common formatting options in Rust",code:`fn main() {
    // Basic formatting
    println!("String: {}", "hello");
    println!("Integer: {}", 42);
    println!("Float: {}", 3.14);

    // Precision for floats
    println!("Two decimals: {:.2}", 3.14159);

    // Padding and alignment
    println!("Right-aligned: {:>10}", "hello");
    println!("Left-aligned: {:>10}", "hello");
    println!("Zero-padded: {:05}", 42);

    // Debug format (works for most types)
    println!("Debug vec: {:?}", vec![1, 2, 3]);
    println!("Debug tuple: {:?}", (1, "hello", true));

    // Multiple values
    let (x, y) = (10, 20);
    println!("x={}, y={}, sum={}", x, y, x + y);

    // Print without newline
    print!("no newline");
    print!(" here\\n");

    // Print to stderr
    eprintln!("This goes to stderr");
}`}),e.jsx("h2",{children:"Project Structure"}),e.jsx("p",{children:"Python and Rust organize projects differently. Python has evolved through several configuration formats (setup.py, setup.cfg, pyproject.toml). Rust has one standard from the start: Cargo."}),e.jsx(a,{title:"Project structure comparison",description:"Rust's project structure is standardized by Cargo, while Python's varies by tooling choice.",pythonCode:`# Python project structure (varies!)
# my_project/
# ├── pyproject.toml    # or setup.py
# ├── src/
# │   └── my_project/
# │       ├── __init__.py
# │       └── main.py
# ├── tests/
# │   └── test_main.py
# ├── requirements.txt  # or in pyproject
# └── README.md

# pyproject.toml
# [project]
# name = "my-project"
# version = "0.1.0"
# dependencies = ["numpy>=1.24"]

# Running:
# python -m my_project
# or: python src/my_project/main.py`,rustCode:`// Rust project structure (standardized)
// my_project/
// ├── Cargo.toml       # THE config file
// ├── Cargo.lock       # pinned deps
// ├── src/
// │   └── main.rs      # entry point
// ├── tests/
// │   └── integration_test.rs
// └── target/          # build artifacts
//     ├── debug/
//     └── release/

// Cargo.toml
// [package]
// name = "my-project"
// version = "0.1.0"
// edition = "2021"
// [dependencies]
// serde = "1.0"

// Running:
// cargo run`}),e.jsx("h2",{children:"cargo new and cargo run"}),e.jsx(n,{language:"bash",title:"Creating and running a Rust project",code:`# Create a new binary project
cargo new greeting
cd greeting

# Project is ready to run immediately
cargo run
# Output: Hello, world!

# Build without running (debug mode)
cargo build
# Binary is at: target/debug/greeting

# Build optimized (release mode)
cargo build --release
# Binary is at: target/release/greeting

# Run the release binary directly
./target/release/greeting

# Check for errors without building fully (faster)
cargo check`}),e.jsxs(r,{type:"tip",title:"Use cargo check for fast feedback",children:["During development, ",e.jsx("code",{children:"cargo check"})," is much faster than ",e.jsx("code",{children:"cargo build"}),"because it skips code generation. It still runs the full type checker and borrow checker, so you get all the error messages without waiting for compilation. Use ",e.jsx("code",{children:"cargo check"})," as you write, ",e.jsx("code",{children:"cargo run"})," when you want to execute."]}),e.jsx("h2",{children:"Cargo.toml in Detail"}),e.jsx(n,{language:"toml",title:"A typical Cargo.toml for a Rust project",code:`[package]
name = "my-data-tool"
version = "0.1.0"
edition = "2021"          # Rust edition (like Python version)
authors = ["Your Name <you@example.com>"]
description = "A fast data processing tool"

[dependencies]
# Simple version requirement
serde = "1.0"             # like numpy>=1.0,<2.0

# With features enabled
serde = { version = "1.0", features = ["derive"] }

# From git
# my_crate = { git = "https://github.com/user/repo" }

[dev-dependencies]
# Only used in tests (like pytest)
tempfile = "3"

[[bin]]
name = "my-tool"          # binary name
path = "src/main.rs"      # entry point`}),e.jsxs(r,{type:"note",title:"Editions are not breaking changes",children:["The ",e.jsx("code",{children:'edition = "2021"'})," field specifies which Rust edition to use. Editions (2015, 2018, 2021, 2024) introduce new syntax and features but are fully backwards compatible — different edition crates can interoperate freely. Always use the latest edition for new projects."]}),e.jsx(f,{title:"Build a Greeting Program",difficulty:"beginner",problem:'Create a new Rust project called "greeting" and modify main.rs to:\n\n1. Declare a variable `name` with your name\n2. Declare a variable `language` set to "Rust"\n3. Declare a variable `experience_years` set to 0\n4. Print a formatted message like: "Hi, I\'m Alice! I have 0 years of Rust experience, but I\'m ready to learn!"\n5. Print the debug representation of a vector containing your favorite programming languages\n\nUse `cargo run` to execute it, then try `cargo build --release` and compare the binary sizes in target/debug/ vs target/release/.',solution:`\`\`\`rust
fn main() {
    let name = "Alice";
    let language = "Rust";
    let experience_years = 0;

    println!(
        "Hi, I'm {}! I have {} years of {} experience, but I'm ready to learn!",
        name, experience_years, language
    );

    let favorites = vec!["Python", "Rust", "SQL"];
    println!("My favorite languages: {:?}", favorites);
}
\`\`\`

Output:
\`\`\`
Hi, I'm Alice! I have 0 years of Rust experience, but I'm ready to learn!
My favorite languages: ["Python", "Rust", "SQL"]
\`\`\`

The debug binary (target/debug/) will be several MB larger than the release binary (target/release/) because it includes debug symbols and is not optimized. In release mode, the compiler applies aggressive optimizations including inlining, dead code elimination, and loop unrolling.`})]})}const G=Object.freeze(Object.defineProperty({__proto__:null,default:z},Symbol.toStringTag,{value:"Module"}));function M(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Variables & Mutability"}),e.jsxs("p",{children:["In Python, every variable is mutable by default — you can reassign any variable at any time to any type. Rust takes the opposite approach: variables are",e.jsx("strong",{children:" immutable by default"}),". You must explicitly opt in to mutability with ",e.jsx("code",{children:"let mut"}),". This is one of Rust's most important design decisions and takes some getting used to."]}),e.jsx(m,{title:"Immutability by Default",children:e.jsxs("p",{children:["Why would a language make variables immutable by default? Because most variables in well-written programs are assigned once and never changed. Immutability makes code easier to reason about — you can see ",e.jsx("code",{children:"let x = 5;"})," and know that",e.jsx("code",{children:"x"})," will be 5 everywhere in its scope. The compiler also uses immutability information to generate better machine code and catch bugs where you accidentally modify something you shouldn't."]})}),e.jsx("h2",{children:"let vs Python Assignment"}),e.jsx(a,{title:"Variable declaration",description:"Python variables are always mutable. Rust variables are immutable unless declared with mut.",pythonCode:`# Python: all variables are mutable
x = 5
print(x)  # 5

x = 10    # reassign — totally fine
print(x)  # 10

x = "now a string"  # even change type
print(x)  # now a string

# No way to make a variable truly
# immutable in Python
# (CONSTANTS are just a convention)`,rustCode:`fn main() {
    // Rust: immutable by default
    let x = 5;
    println!("{}", x); // 5

    // x = 10;  // ERROR: cannot assign
    //          // twice to immutable
    //          // variable \`x\`

    // Must explicitly opt in to mutability
    let mut y = 5;
    println!("{}", y); // 5
    y = 10;            // OK — y is mut
    println!("{}", y); // 10

    // But still can't change the type:
    // y = "string"; // ERROR: expected
    //               // integer, found &str
}`}),e.jsxs(r,{type:"pythonista",title:"This feels backwards at first",children:['Coming from Python, you might think "why would I want immutable variables?" But consider: how often do you actually need to reassign a variable after its initial assignment? In most functions, variables are set once and read many times. Rust makes the common case (immutable) the default, and the less common case (mutable) explicit. After a while, ',e.jsx("code",{children:"let mut"}),' starts to feel like a helpful signal: "pay attention, this value will change."']}),e.jsx("h2",{children:"let mut for Mutable Variables"}),e.jsx(n,{language:"rust",title:"Using mutable variables",code:`fn main() {
    // Building up a result
    let mut total = 0;
    for i in 1..=10 {
        total += i;
    }
    println!("Sum: {}", total); // Sum: 55

    // Modifying a string
    let mut greeting = String::from("Hello");
    greeting.push_str(", world!");
    println!("{}", greeting); // Hello, world!

    // Modifying a vector
    let mut numbers = vec![1, 2, 3];
    numbers.push(4);
    numbers.push(5);
    println!("{:?}", numbers); // [1, 2, 3, 4, 5]

    // Counting in a loop
    let mut count = 0;
    let names = vec!["Alice", "Bob", "Charlie"];
    for _name in &names {
        count += 1;
    }
    println!("Count: {}", count); // Count: 3
}`}),e.jsx("h2",{children:"Shadowing: Redeclaring with let"}),e.jsxs("p",{children:["Rust has a powerful feature called ",e.jsx("strong",{children:"shadowing"}),": you can declare a new variable with the same name using ",e.jsx("code",{children:"let"}),", which creates an entirely new variable that shadows the previous one. Unlike mutation, shadowing can change the type."]}),e.jsx(a,{title:"Shadowing vs reassignment",description:"Rust's shadowing creates a new variable with the same name, which can even have a different type.",pythonCode:`# Python: reassignment (same variable)
x = "   hello   "
x = x.strip()     # still a str
x = len(x)        # now an int
print(x)           # 5

# The variable x was mutated in place
# (well, rebound to new objects)
# Python doesn't distinguish between
# "new variable" and "changed variable"`,rustCode:`fn main() {
    // Rust: shadowing (new variable)
    let x = "   hello   ";
    let x = x.trim();     // new x: &str
    let x = x.len();      // new x: usize
    println!("{}", x);     // 5

    // Each \`let x\` creates a NEW variable
    // The old one is gone (shadowed)

    // This is different from mut:
    let mut y = 5;
    y = 10;    // same variable, new value
    // y = "hi"; // ERROR: can't change type

    let y = "hi"; // NEW variable shadows old y
    println!("{}", y); // OK: y is now a &str
}`}),e.jsx(n,{language:"rust",title:"Common shadowing patterns",code:`fn main() {
    // Parse a string to a number (same name, different type)
    let input = "42";
    let input: i32 = input.parse().expect("not a number");
    println!("Parsed: {}", input);

    // Transform data through a pipeline
    let data = "  Hello, World!  ";
    let data = data.trim();
    let data = data.to_uppercase();
    println!("{}", data); // "HELLO, WORLD!"

    // Narrow a type after validation
    let config_value = Some(42);
    if let Some(config_value) = config_value {
        // config_value is now i32, not Option<i32>
        println!("Config: {}", config_value);
    }
}`}),e.jsxs(r,{type:"tip",title:"Shadowing vs mut: when to use which",children:["Use ",e.jsx("code",{children:"let mut"})," when you need to update a value repeatedly (counters, accumulators, buffers). Use shadowing when you are transforming a value through stages and the old value is no longer needed — especially when the type changes. Shadowing keeps variables immutable at each stage, which helps the compiler and makes the code easier to read."]}),e.jsx("h2",{children:"Constants"}),e.jsxs("p",{children:["Rust also has ",e.jsx("code",{children:"const"})," for truly constant values. Unlike ",e.jsx("code",{children:"let"}),", constants must have explicit type annotations, must be set to a compile-time constant expression, and are valid for the entire duration of the program."]}),e.jsx(n,{language:"rust",title:"Constants vs let bindings",code:`// Constants: must be compile-time known, always annotated
const MAX_RETRIES: u32 = 3;
const PI: f64 = 3.141592653589793;
const APP_NAME: &str = "my-data-tool";

// Convention: SCREAMING_SNAKE_CASE (like Python)

fn main() {
    // 'let' bindings are set at runtime
    let user_input = "42";
    let parsed: i32 = user_input.parse().unwrap();

    // Constants can be used anywhere in scope
    println!("{} will retry up to {} times", APP_NAME, MAX_RETRIES);

    // Static variables: like const but with a fixed memory address
    // (rarely needed — prefer const)
    static VERSION: &str = "1.0.0";
    println!("Version: {}", VERSION);
}`}),e.jsxs(r,{type:"pythonista",title:"Python's 'constants' are just conventions",children:["Python has no real constants — ",e.jsx("code",{children:"MAX_RETRIES = 3"})," is just a variable that everyone agrees not to change. Rust's ",e.jsx("code",{children:"const"})," is enforced by the compiler. You literally cannot modify it, and the compiler can inline it everywhere for better performance."]}),e.jsx("h2",{children:"Type Inference"}),e.jsxs("p",{children:["Rust has powerful type inference. In most cases, the compiler figures out the type from context, so you don't need to annotate every variable. But you always",e.jsx("em",{children:"can"})," annotate — and sometimes you must."]}),e.jsx(n,{language:"rust",title:"Type inference in action",code:`fn main() {
    // Compiler infers the type
    let x = 42;           // i32 (default integer type)
    let y = 3.14;         // f64 (default float type)
    let active = true;    // bool
    let name = "Alice";   // &str

    // Explicit annotation (same result)
    let x: i32 = 42;
    let y: f64 = 3.14;
    let active: bool = true;
    let name: &str = "Alice";

    // Sometimes the compiler needs help
    let numbers: Vec<i32> = Vec::new(); // empty vec — type needed
    // Or use the turbofish syntax:
    let numbers = Vec::<i32>::new();
    // Or let inference figure it out from usage:
    let mut numbers = Vec::new();
    numbers.push(42); // now compiler knows it's Vec<i32>

    // Parsing requires a type hint
    let n: i32 = "42".parse().unwrap();
    // Or with turbofish:
    let n = "42".parse::<i32>().unwrap();
}`}),e.jsx(f,{title:"Variables and Mutability Practice",difficulty:"beginner",problem:'Write a Rust program that:\n\n1. Declares an immutable variable `name` with your name.\n2. Declares a mutable variable `score` starting at 0.\n3. In a loop from 1 to 5, add each number to `score`.\n4. Use shadowing to convert `score` from i32 to a String that says "Final score: X".\n5. Declare a constant `MAX_SCORE` of 100.\n6. Print whether the score exceeds MAX_SCORE.\n\nTry to predict what the compiler will say if you:\n- Remove `mut` from score and try to add to it.\n- Try to change `name` to a number without using `let`.',solution:`\`\`\`rust
const MAX_SCORE: i32 = 100;

fn main() {
    let name = "Alice";

    let mut score: i32 = 0;
    for i in 1..=5 {
        score += i;
    }
    println!("{}'s score: {}", name, score); // Alice's score: 15

    // Shadow score as a String
    let score = format!("Final score: {}", score);
    println!("{}", score); // Final score: 15

    // We'd need the original i32 to compare, so let's parse it back
    // or just keep a copy before shadowing:
    let numeric_score: i32 = 15;
    if numeric_score > MAX_SCORE {
        println!("Exceeded max score!");
    } else {
        println!("Within limits (max: {})", MAX_SCORE);
    }
}
\`\`\`

Without \`mut\` on score: the compiler says "cannot assign twice to immutable variable \`score\`" and points to the exact line.

Changing name to a number without \`let\`: the compiler says "expected \`&str\`, found integer" because you can't change a variable's type through assignment — only through shadowing with a new \`let\`.`})]})}const K=Object.freeze(Object.defineProperty({__proto__:null,default:M},Symbol.toStringTag,{value:"Module"}));function A(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Basic Types"}),e.jsxs("p",{children:["Python has a small set of built-in types with few surprises: ",e.jsx("code",{children:"int"}),",",e.jsx("code",{children:"float"}),", ",e.jsx("code",{children:"str"}),", ",e.jsx("code",{children:"bool"}),", ",e.jsx("code",{children:"list"}),",",e.jsx("code",{children:"tuple"}),". Rust has a richer type system with explicit control over memory layout and size. Knowing exactly how many bytes your integer uses might seem pedantic, but it is essential for performance-critical code and interacting with C/hardware/GPUs."]}),e.jsxs(m,{title:"Scalar Types in Rust",children:[e.jsx("p",{children:"Rust has four categories of scalar (single-value) types:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Integers:"})," i8, i16, i32, i64, i128, isize (signed) and u8, u16, u32, u64, u128, usize (unsigned)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Floats:"})," f32, f64"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Boolean:"})," bool (true/false)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Character:"})," char (4-byte Unicode scalar value)"]})]}),e.jsxs("p",{children:["The number in the type name tells you how many bits it uses. ",e.jsx("code",{children:"i32"})," is a 32-bit signed integer. ",e.jsx("code",{children:"u8"})," is an 8-bit unsigned integer (0-255). This explicitness means you always know exactly how much memory a value occupies."]})]}),e.jsx("h2",{children:"Integers"}),e.jsx(a,{title:"Integer types",description:"Python has one unlimited-precision int. Rust has many fixed-size integer types for explicit memory control.",pythonCode:`# Python: one int type, unlimited size
x = 42
big = 2 ** 1000  # works fine!

# No overflow — Python grows the int
print(big)  # a number with 302 digits

# You never think about how many bytes
# an integer takes up

# Type checking
print(type(x))    # <class 'int'>
print(isinstance(x, int))  # True`,rustCode:`fn main() {
    // Rust: explicit integer sizes
    let a: i8  = 127;       // -128 to 127
    let b: u8  = 255;       // 0 to 255
    let c: i32 = 42;        // default int type
    let d: i64 = 1_000_000; // underscores for readability
    let e: u64 = 42;        // unsigned 64-bit

    // isize/usize: pointer-sized (64-bit on
    // modern systems), used for indexing
    let index: usize = 0;

    // Integer overflow is caught in debug:
    // let overflow: u8 = 256; // ERROR

    // Literal suffixes
    let x = 42_i64;  // i64
    let y = 0xff_u8;  // hex: 255
    let z = 0b1010;   // binary: 10
    let w = 0o77;     // octal: 63
}`}),e.jsxs(r,{type:"pythonista",title:"Why so many integer types?",children:["Python's unlimited-precision integers are convenient but slow — each arithmetic operation checks the size and may allocate memory. Rust's fixed-size integers map directly to CPU registers and compile to single machine instructions. When processing millions of data points, this difference matters. For most code, ",e.jsx("code",{children:"i32"})," or ",e.jsx("code",{children:"i64"})," is the right choice. Use ",e.jsx("code",{children:"usize"})," for array indices and lengths."]}),e.jsx("h2",{children:"Floating Point Numbers"}),e.jsx(a,{title:"Float types",description:"Python has one float (64-bit). Rust gives you f32 and f64.",pythonCode:`# Python: one float type (64-bit IEEE 754)
x = 3.14
y = 2.0e10     # scientific notation
z = float('inf')

# Floating point imprecision exists
print(0.1 + 0.2)  # 0.30000000000000004

# Math operations
import math
print(math.sqrt(2.0))
print(math.pi)
print(abs(-3.5))`,rustCode:`fn main() {
    // Rust: f32 (32-bit) and f64 (64-bit)
    let x: f64 = 3.14;     // default float
    let y: f32 = 2.0;      // 32-bit float
    let z = 2.0e10_f64;    // scientific

    // Same imprecision (IEEE 754)
    println!("{}", 0.1_f64 + 0.2); // 0.3...04

    // Math operations are methods
    println!("{}", 2.0_f64.sqrt());
    println!("{}", std::f64::consts::PI);
    println!("{}", (-3.5_f64).abs());

    // f32 vs f64: use f32 for GPU/ML
    // tensors, f64 for general computation
    let precise: f64 = 1.0 / 3.0;
    let fast: f32 = 1.0 / 3.0;
    println!("f64: {:.10}", precise);
    println!("f32: {:.10}", fast);
}`}),e.jsxs(r,{type:"tip",title:"f32 vs f64 in ML",children:["In machine learning, ",e.jsx("code",{children:"f32"})," is standard for model weights and tensors because GPUs process 32-bit floats much faster, and the extra precision of f64 rarely matters for neural networks. When doing scientific computation or financial calculations, prefer ",e.jsx("code",{children:"f64"}),". Rust defaults to ",e.jsx("code",{children:"f64"}),"."]}),e.jsx("h2",{children:"Booleans and Characters"}),e.jsx(n,{language:"rust",title:"bool and char types",code:`fn main() {
    // bool: true or false (lowercase!)
    let is_active: bool = true;
    let is_empty = false;

    // No truthy/falsy — must be explicit
    let count = 5;
    // if count { }          // ERROR
    if count > 0 { }         // OK
    if is_active { }         // OK

    // Boolean operations
    let both = is_active && !is_empty;
    let either = is_active || is_empty;
    println!("both: {}, either: {}", both, either);

    // char: a Unicode scalar value (4 bytes!)
    let letter: char = 'A';
    let emoji: char = '🦀';     // Rust's mascot!
    let chinese: char = '中';

    // char is NOT the same as a single-char string
    let c: char = 'A';        // char — 4 bytes
    let s: &str = "A";        // string slice — 1+ bytes

    println!("letter: {}, emoji: {}", letter, emoji);
    println!("Is alphabetic: {}", letter.is_alphabetic());
    println!("Is digit: {}", '7'.is_ascii_digit());
}`}),e.jsxs(r,{type:"pythonista",title:"char vs str",children:["Python has no separate character type — a single character is just a",e.jsx("code",{children:"str"})," of length 1. Rust distinguishes between ",e.jsx("code",{children:"char"}),"(a single Unicode scalar, always 4 bytes, uses single quotes) and",e.jsx("code",{children:"&str"}),"/",e.jsx("code",{children:"String"})," (a sequence of UTF-8 bytes, uses double quotes). This distinction matters when you need to work with individual characters vs byte strings."]}),e.jsx("h2",{children:"Strings: String vs &str"}),e.jsx("p",{children:"Strings in Rust are more complex than in Python because Rust gives you control over memory. There are two main string types, and understanding the difference early prevents confusion later."}),e.jsx(n,{language:"rust",title:"Two string types: String and &str",code:`fn main() {
    // &str — a string SLICE (borrowed reference)
    // Fixed-size view into string data. Cannot grow.
    let greeting: &str = "hello, world";

    // String — an owned, heap-allocated string
    // Can grow, shrink, and be modified.
    let mut name = String::from("Alice");
    name.push_str(" Smith");
    println!("{}", name); // Alice Smith

    // Converting between them
    let s: &str = "hello";
    let owned: String = s.to_string();     // &str → String
    let owned2: String = String::from(s);  // same thing
    let borrowed: &str = &owned;           // String → &str

    // String formatting creates a String
    let msg = format!("Hello, {}!", name);
    println!("{}", msg);

    // Common string methods (similar to Python)
    let text = "  Hello, World!  ";
    println!("{}", text.trim());              // trim whitespace
    println!("{}", text.to_uppercase());      // uppercase
    println!("{}", text.contains("World"));   // true
    println!("{}", text.replace("World", "Rust"));

    let parts: Vec<&str> = "a,b,c".split(',').collect();
    println!("{:?}", parts); // ["a", "b", "c"]
}`}),e.jsx("h2",{children:"Tuples and Arrays"}),e.jsx(a,{title:"Tuples and arrays",description:"Rust tuples are similar to Python's, but arrays are fixed-size and single-type (unlike Python lists).",pythonCode:`# Python tuple: immutable, mixed types
point = (10, 20)
record = ("Alice", 30, True)

# Destructuring
x, y = point
name, age, active = record

# Access by index
print(point[0])  # 10

# Python list: mutable, mixed types
nums = [1, 2, 3, 4, 5]
mixed = [1, "hello", True]
nums.append(6)
print(len(nums))  # 6`,rustCode:`fn main() {
    // Rust tuple: fixed-size, mixed types
    let point: (i32, i32) = (10, 20);
    let record = ("Alice", 30, true);

    // Destructuring
    let (x, y) = point;
    let (name, age, active) = record;

    // Access by index (dot notation!)
    println!("{}", point.0); // 10
    println!("{}", point.1); // 20

    // Rust array: fixed-size, SINGLE type
    let nums: [i32; 5] = [1, 2, 3, 4, 5];
    // [type; length] — length is part of type!
    let zeros = [0; 10]; // ten zeros

    println!("{}", nums[0]); // 1
    println!("{}", nums.len()); // 5

    // For growable collections, use Vec
    let mut v = vec![1, 2, 3];
    v.push(4);
    println!("{:?}", v); // [1, 2, 3, 4]
}`}),e.jsxs(r,{type:"warning",title:"Arrays vs Vec",children:["Rust arrays (",e.jsx("code",{children:"[i32; 5]"}),") have a fixed length known at compile time and live on the stack. For a growable, heap-allocated collection like Python's",e.jsx("code",{children:"list"}),", use ",e.jsx("code",{children:"Vec<T>"}),". You will use ",e.jsx("code",{children:"Vec"}),"far more often than arrays, just as you use ",e.jsx("code",{children:"list"})," far more than",e.jsx("code",{children:"tuple"})," in Python."]}),e.jsx("h2",{children:"Type Annotations"}),e.jsx(n,{language:"rust",title:"Type annotation syntax",code:`fn main() {
    // Variable annotations
    let x: i32 = 42;
    let name: &str = "Alice";
    let scores: Vec<f64> = vec![95.5, 87.0, 92.3];

    // Function signatures (always required)
    fn add(a: i32, b: i32) -> i32 {
        a + b
    }

    // Generic type annotations
    let numbers: Vec<i32> = Vec::new();
    let lookup: std::collections::HashMap<String, i32> =
        std::collections::HashMap::new();

    // Turbofish syntax (inline type parameter)
    let parsed = "42".parse::<i32>().unwrap();
    let collected: Vec<i32> = (0..5).collect();
    // or:
    let collected = (0..5).collect::<Vec<i32>>();

    println!("{}, {}", add(2, 3), parsed);
}`}),e.jsx(f,{title:"Type Explorer",difficulty:"beginner",problem:`Write a Rust program that declares variables of each basic type and prints them:

1. An i32 integer set to your birth year
2. A u8 integer set to your age (what happens if age > 255?)
3. An f64 float set to your height in meters
4. A bool indicating whether you like Rust so far
5. A char set to the first letter of your name
6. A &str set to your favorite programming language
7. A String created by formatting your name with String::from() or format!()
8. A tuple containing (year, age, height)
9. An array of 5 i32 scores
10. A Vec<String> containing three programming languages

For each, print both the value and use {:?} debug format.

Bonus: Try assigning a value of 256 to a u8 variable and read the compiler error.`,solution:`\`\`\`rust
fn main() {
    let birth_year: i32 = 1995;
    let age: u8 = 29;
    let height: f64 = 1.75;
    let likes_rust: bool = true;
    let initial: char = 'A';
    let fav_lang: &str = "Python";
    let name: String = format!("Alice from {}", fav_lang);
    let info: (i32, u8, f64) = (birth_year, age, height);
    let scores: [i32; 5] = [95, 87, 92, 88, 91];
    let languages: Vec<String> = vec![
        String::from("Python"),
        String::from("Rust"),
        String::from("SQL"),
    ];

    println!("Year: {} | {:?}", birth_year, birth_year);
    println!("Age: {} | {:?}", age, age);
    println!("Height: {} | {:?}", height, height);
    println!("Likes Rust: {} | {:?}", likes_rust, likes_rust);
    println!("Initial: {} | {:?}", initial, initial);
    println!("Fav lang: {} | {:?}", fav_lang, fav_lang);
    println!("Name: {} | {:?}", name, name);
    println!("Info: {:?}", info);
    println!("Scores: {:?}", scores);
    println!("Languages: {:?}", languages);
}
\`\`\`

Trying \`let age: u8 = 256;\` gives a compile error: "literal out of range for \`u8\`". The compiler catches overflow at compile time for literals. For runtime overflow, debug mode panics and release mode wraps around (256_u8 becomes 0).`})]})}const $=Object.freeze(Object.defineProperty({__proto__:null,default:A},Symbol.toStringTag,{value:"Module"}));function B(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"If/Else Expressions"}),e.jsxs("p",{children:["Rust's ",e.jsx("code",{children:"if/else"})," looks familiar, but there is a crucial difference: in Rust, ",e.jsx("code",{children:"if/else"})," is an ",e.jsx("strong",{children:"expression"}),", not a statement. This means it returns a value, and you can use it on the right side of a",e.jsx("code",{children:"let"})," binding. This concept — that most things are expressions — is a core part of Rust's design and will feel natural once you get used to it."]}),e.jsx(m,{title:"Expressions vs Statements",children:e.jsxs("p",{children:["In Python, ",e.jsx("code",{children:"if/else"})," is a statement — it performs an action but does not produce a value (except for the ternary ",e.jsx("code",{children:"x if cond else y"}),"). In Rust, almost everything is an expression that produces a value:",e.jsx("code",{children:"if/else"}),", blocks ",e.jsx("code",{children:"{}"}),", and even ",e.jsx("code",{children:"match"}),". The last expression in a block (without a semicolon) becomes the block's value."]})}),e.jsx("h2",{children:"Basic If/Else"}),e.jsx(a,{title:"If/else syntax",description:"Rust uses curly braces instead of indentation, and no parentheses around the condition.",pythonCode:`temperature = 35

if temperature > 30:
    print("It's hot!")
elif temperature > 20:
    print("It's nice.")
elif temperature > 10:
    print("It's cool.")
else:
    print("It's cold!")

# Indentation defines the blocks
# Colon after the condition`,rustCode:`fn main() {
    let temperature = 35;

    if temperature > 30 {
        println!("It's hot!");
    } else if temperature > 20 {
        println!("It's nice.");
    } else if temperature > 10 {
        println!("It's cool.");
    } else {
        println!("It's cold!");
    }

    // No parentheses needed (but allowed)
    // Curly braces required (always)
    // "else if" instead of "elif"
}`}),e.jsx("h2",{children:"If as an Expression"}),e.jsxs("p",{children:["This is where Rust's ",e.jsx("code",{children:"if"})," really differs from Python. Because",e.jsx("code",{children:"if/else"})," is an expression, it produces a value that you can assign to a variable."]}),e.jsx(a,{title:"Conditional expressions",description:"Python uses the ternary operator for inline conditionals. Rust uses the regular if/else as an expression.",pythonCode:`age = 20

# Python ternary (inline conditional)
status = "adult" if age >= 18 else "minor"
print(status)

# For anything complex, you need a
# regular if/else statement
if age >= 65:
    category = "senior"
elif age >= 18:
    category = "adult"
else:
    category = "minor"

# The variable might be unset if you
# forget a branch (no compiler help)`,rustCode:`fn main() {
    let age = 20;

    // if/else IS the expression
    let status = if age >= 18 {
        "adult"
    } else {
        "minor"
    };
    println!("{}", status);

    // Works with multiple branches too
    let category = if age >= 65 {
        "senior"
    } else if age >= 18 {
        "adult"
    } else {
        "minor"
    };

    // Compiler ensures:
    // 1. All branches return same type
    // 2. All cases are covered
    println!("{}", category);
}`}),e.jsxs(r,{type:"pythonista",title:"The semicolons matter!",children:["Notice the semicolon after the closing brace: ",e.jsx("code",{children:"};"}),". The",e.jsx("code",{children:"if/else"})," block is an expression that produces a value, and",e.jsx("code",{children:"let status = ...;"})," is a statement that binds that value. Also notice the values inside the branches have ",e.jsx("strong",{children:"no semicolons"})," — that makes them expressions (return values). Adding a semicolon would turn them into statements that return ",e.jsx("code",{children:"()"})," (the unit type, like Python's ",e.jsx("code",{children:"None"}),")."]}),e.jsx(n,{language:"rust",title:"More expression examples",code:`fn main() {
    let x = 5;

    // Use if-expression inline
    println!("x is {}", if x > 0 { "positive" } else { "non-positive" });

    // Blocks are expressions too
    let result = {
        let a = 10;
        let b = 20;
        a + b   // no semicolon = this is the value
    };
    println!("result: {}", result); // 30

    // Combine with functions
    let score = 85;
    let grade = calculate_grade(score);
    println!("Grade: {}", grade);
}

fn calculate_grade(score: i32) -> &'static str {
    if score >= 90 {
        "A"
    } else if score >= 80 {
        "B"
    } else if score >= 70 {
        "C"
    } else if score >= 60 {
        "D"
    } else {
        "F"
    }
    // No return keyword needed — the last expression
    // is the return value
}`}),e.jsx("h2",{children:"No Truthy/Falsy Values"}),e.jsxs("p",{children:["Python has extensive truthy/falsy rules: empty collections are falsy, zero is falsy, ",e.jsx("code",{children:"None"})," is falsy, empty strings are falsy. Rust has none of this. The condition in an ",e.jsx("code",{children:"if"})," must be exactly ",e.jsx("code",{children:"bool"}),"."]}),e.jsx(a,{title:"Boolean conditions",description:"Python auto-converts values to bool. Rust requires explicit bool expressions.",pythonCode:`# Python: truthy/falsy everywhere
items = [1, 2, 3]
if items:          # truthy: non-empty list
    print("has items")

name = ""
if not name:       # falsy: empty string
    print("no name")

count = 0
if count:          # falsy: zero
    print("has count")

value = None
if value:          # falsy: None
    print("has value")`,rustCode:`fn main() {
    let items = vec![1, 2, 3];
    // if items { }  // ERROR: expected bool
    if !items.is_empty() {
        println!("has items");
    }

    let name = "";
    // if !name { }  // ERROR: expected bool
    if name.is_empty() {
        println!("no name");
    }

    let count = 0;
    // if count { }  // ERROR: expected bool
    if count != 0 {
        println!("has count");
    }

    let value: Option<i32> = None;
    // if value { }  // ERROR: expected bool
    if value.is_some() {
        println!("has value");
    }
}`}),e.jsxs(r,{type:"tip",title:"This prevents a common bug class",children:["Python's truthy/falsy rules are a frequent source of bugs. For example,",e.jsx("code",{children:"if result:"})," does different things for ",e.jsx("code",{children:"None"}),",",e.jsx("code",{children:"0"}),", ",e.jsx("code",{children:"[]"}),", and ",e.jsx("code",{children:'""'})," — all are falsy. Rust forces you to say exactly what you mean: ",e.jsx("code",{children:"result.is_some()"}),",",e.jsx("code",{children:"result != 0"}),", ",e.jsx("code",{children:"!result.is_empty()"}),". This explicitness eliminates an entire class of subtle logic bugs."]}),e.jsx("h2",{children:"if let — Pattern Matching in Conditionals"}),e.jsx(n,{language:"rust",title:"if let for concise pattern matching",code:`fn main() {
    // Option handling with if let
    let config_value: Option<i32> = Some(42);

    // Verbose way with match
    match config_value {
        Some(val) => println!("Got: {}", val),
        None => println!("No value"),
    }

    // Concise way with if let
    if let Some(val) = config_value {
        println!("Got: {}", val);
    } else {
        println!("No value");
    }

    // Great for checking one specific pattern
    let result: Result<i32, String> = Ok(100);
    if let Ok(value) = result {
        println!("Success: {}", value);
    }

    // Combine with other conditions
    let age: Option<u32> = Some(25);
    if let Some(a) = age {
        if a >= 18 {
            println!("Adult, age {}", a);
        }
    }
}`}),e.jsx(f,{title:"Expression-Based Conditionals",difficulty:"beginner",problem:`Write a Rust function called \`classify_bmi\` that takes a \`f64\` BMI value and returns a &str classification:

- Below 18.5: "underweight"
- 18.5 to 24.9: "normal"
- 25.0 to 29.9: "overweight"
- 30.0 and above: "obese"

Requirements:
1. Use if/else as an EXPRESSION to return the value (no return keyword).
2. In main(), use the function with at least 3 different values.
3. Use a let binding with an if expression to create a message like "Your BMI of 22.5 is normal."
4. Bonus: Handle the edge case where BMI is negative by returning "invalid".`,solution:`\`\`\`rust
fn classify_bmi(bmi: f64) -> &'static str {
    if bmi < 0.0 {
        "invalid"
    } else if bmi < 18.5 {
        "underweight"
    } else if bmi < 25.0 {
        "normal"
    } else if bmi < 30.0 {
        "overweight"
    } else {
        "obese"
    }
}

fn main() {
    let test_values = [16.0, 22.5, 27.0, 35.0, -1.0];

    for &bmi in &test_values {
        let category = classify_bmi(bmi);
        let message = if category == "invalid" {
            format!("BMI of {} is not valid", bmi)
        } else {
            format!("Your BMI of {} is classified as {}", bmi, category)
        };
        println!("{}", message);
    }
}
\`\`\`

Output:
\`\`\`
Your BMI of 16 is classified as underweight
Your BMI of 22.5 is classified as normal
Your BMI of 27 is classified as overweight
Your BMI of 35 is classified as obese
BMI of -1 is not valid
\`\`\`

Key points: the function body is a single if/else expression with no \`return\` keyword. The last expression in each branch (the string literal) is the return value because it has no semicolon.`})]})}const X=Object.freeze(Object.defineProperty({__proto__:null,default:B},Symbol.toStringTag,{value:"Module"}));function F(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Loops"}),e.jsxs("p",{children:["Rust has three kinds of loops: ",e.jsx("code",{children:"loop"})," (infinite), ",e.jsx("code",{children:"while"}),"(conditional), and ",e.jsx("code",{children:"for"})," (iterator-based). If you come from Python, the ",e.jsx("code",{children:"for"})," loop will feel familiar, but Rust adds powerful features like loop labels, breaking with values, and explicit iterator methods that give you fine-grained control over how you traverse data."]}),e.jsxs(m,{title:"Three Loop Types",children:[e.jsxs("p",{children:["Python has two loop constructs: ",e.jsx("code",{children:"for"})," and ",e.jsx("code",{children:"while"}),". Rust adds a third: ",e.jsx("code",{children:"loop"}),", which is an explicit infinite loop. This might seem unnecessary, but it is important because Rust can infer that ",e.jsx("code",{children:"loop"})," always runs at least once, enabling the loop to return a value via ",e.jsx("code",{children:"break"}),". Each loop type has a clear purpose:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"loop"})," — run forever until explicitly broken out of; can return a value"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"while"})," — run while a condition is true"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"for"})," — iterate over a collection or range"]})]})]}),e.jsx("h2",{children:"The for Loop"}),e.jsx(a,{title:"For loop basics",description:"Rust's for loop is very similar to Python's, iterating over anything that implements the Iterator trait.",pythonCode:`# Python: for item in iterable
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Range-based
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Range with start, stop, step
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8

# Enumerate for index + value
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")`,rustCode:`fn main() {
    let fruits = vec!["apple", "banana", "cherry"];
    for fruit in &fruits {
        println!("{}", fruit);
    }

    // Range-based (.. is exclusive end)
    for i in 0..5 {
        println!("{}", i); // 0, 1, 2, 3, 4
    }

    // Inclusive range (..= includes end)
    for i in 1..=5 {
        println!("{}", i); // 1, 2, 3, 4, 5
    }

    // Step with .step_by()
    for i in (0..10).step_by(2) {
        println!("{}", i); // 0, 2, 4, 6, 8
    }

    // Enumerate for index + value
    for (i, fruit) in fruits.iter().enumerate() {
        println!("{}: {}", i, fruit);
    }
}`}),e.jsxs(r,{type:"pythonista",title:"The & in 'for fruit in &fruits'",children:["The ",e.jsx("code",{children:"&"})," borrows the vector instead of consuming it. Without it,",e.jsx("code",{children:"for fruit in fruits"})," would ",e.jsx("em",{children:"move"})," the vector into the loop and you could not use ",e.jsx("code",{children:"fruits"})," afterward. This is Rust's ownership system in action. When iterating, you almost always want ",e.jsx("code",{children:"&collection"}),"(borrow) rather than ",e.jsx("code",{children:"collection"})," (consume)."]}),e.jsx("h2",{children:"while Loops"}),e.jsx(a,{title:"While loops",description:"while loops are nearly identical in both languages.",pythonCode:`# Python while loop
count = 0
while count < 5:
    print(count)
    count += 1

# While with break
total = 0
while True:
    total += 1
    if total >= 100:
        break

# While with continue
for i in range(10):
    if i % 3 == 0:
        continue
    print(i)  # 1, 2, 4, 5, 7, 8`,rustCode:`fn main() {
    // Rust while loop
    let mut count = 0;
    while count < 5 {
        println!("{}", count);
        count += 1;
    }

    // break and continue work the same
    let mut total = 0;
    while total < 100 {
        total += 1;
    }

    // continue to skip iterations
    for i in 0..10 {
        if i % 3 == 0 {
            continue;
        }
        println!("{}", i); // 1, 2, 4, 5, 7, 8
    }
}`}),e.jsx("h2",{children:"loop — Infinite Loops with Superpowers"}),e.jsxs("p",{children:["Rust's ",e.jsx("code",{children:"loop"})," keyword creates an infinite loop, similar to Python's",e.jsx("code",{children:"while True"}),". But ",e.jsx("code",{children:"loop"})," has a unique superpower: you can ",e.jsx("code",{children:"break"})," with a value, turning the loop into an expression."]}),e.jsx(n,{language:"rust",title:"loop with break values",code:`fn main() {
    // Basic infinite loop
    let mut counter = 0;
    loop {
        counter += 1;
        if counter >= 5 {
            break;
        }
    }
    println!("Counter: {}", counter);

    // loop as an expression — break returns a value
    let mut attempts = 0;
    let result = loop {
        attempts += 1;
        if attempts * attempts >= 50 {
            break attempts; // this value is assigned to 'result'
        }
    };
    println!("Took {} attempts", result); // 8

    // Practical example: retry logic
    let mut retries = 0;
    let data = loop {
        retries += 1;
        let success = retries >= 3; // simulate flaky operation
        if success {
            break format!("Got data after {} tries", retries);
        }
        if retries >= 10 {
            break String::from("Failed after max retries");
        }
    };
    println!("{}", data);
}`}),e.jsxs(r,{type:"tip",title:"When to use each loop type",children:["Use ",e.jsx("code",{children:"for"})," when iterating over a collection or range (most common). Use ",e.jsx("code",{children:"while"})," when looping based on a condition. Use ",e.jsx("code",{children:"loop"}),"when you need an infinite loop or want to break with a value. In practice,",e.jsx("code",{children:"for"})," handles 90% of cases, just like in Python."]}),e.jsx("h2",{children:"Loop Labels"}),e.jsxs("p",{children:["Rust lets you label loops and ",e.jsx("code",{children:"break"})," or ",e.jsx("code",{children:"continue"}),"specific outer loops from inside nested loops. Python has no equivalent — you would need flags or functions to break out of nested loops."]}),e.jsx(n,{language:"rust",title:"Loop labels for nested loop control",code:`fn main() {
    // Label a loop with 'name:
    'outer: for i in 0..5 {
        for j in 0..5 {
            if i + j > 4 {
                println!("Breaking outer at i={}, j={}", i, j);
                break 'outer; // breaks the OUTER loop
            }
            println!("  i={}, j={}", i, j);
        }
    }

    // Continue an outer loop
    'rows: for row in 0..3 {
        for col in 0..3 {
            if col == 1 {
                continue 'rows; // skip to next row
            }
            println!("({}, {})", row, col);
        }
    }
    // Output: (0,0), (1,0), (2,0)

    // Break outer loop with a value
    let result = 'search: loop {
        for i in 0..100 {
            if i * i > 200 {
                break 'search i;
            }
        }
        break 'search -1; // fallback
    };
    println!("First i where i^2 > 200: {}", result); // 15
}`}),e.jsx("h2",{children:"Iterators: iter(), iter_mut(), into_iter()"}),e.jsx("p",{children:"Rust gives you three ways to iterate over a collection, each with different ownership semantics. This is unique to Rust and directly tied to the ownership system."}),e.jsx(n,{language:"rust",title:"Three iteration methods",code:`fn main() {
    let mut numbers = vec![1, 2, 3, 4, 5];

    // .iter() — borrows each element (&T)
    // Collection is NOT consumed; elements are read-only
    for n in numbers.iter() {
        println!("Borrowed: {}", n);
    }
    println!("Vec still usable: {:?}", numbers);

    // .iter_mut() — mutably borrows each element (&mut T)
    // Collection is NOT consumed; elements can be modified
    for n in numbers.iter_mut() {
        *n *= 2; // double each element in place
    }
    println!("Doubled: {:?}", numbers); // [2, 4, 6, 8, 10]

    // .into_iter() — takes ownership of each element (T)
    // Collection IS consumed; cannot use it afterward
    let names = vec!["Alice", "Bob", "Charlie"];
    for name in names.into_iter() {
        println!("Owned: {}", name);
    }
    // println!("{:?}", names); // ERROR: names was consumed

    // Shorthand equivalents:
    let v = vec![1, 2, 3];
    for x in &v { }        // same as v.iter()
    // for x in &mut v { } // same as v.iter_mut()
    for x in v { }         // same as v.into_iter()
    // v is consumed here
}`}),e.jsxs(r,{type:"pythonista",title:"Python iteration is always by reference",children:["In Python, ",e.jsx("code",{children:"for item in my_list"})," gives you references to objects, and the list remains intact. Rust's ",e.jsx("code",{children:"for item in vec"})," (without",e.jsx("code",{children:"&"}),") ",e.jsx("em",{children:"consumes"})," the vector. This is the ownership system: Rust needs to know who owns the data. Use ",e.jsx("code",{children:"&vec"})," for Python-like behavior, ",e.jsx("code",{children:"&mut vec"})," to modify in place, and plain ",e.jsx("code",{children:"vec"}),"to take ownership (rare in loops)."]}),e.jsx("h2",{children:"Iterator Adaptors"}),e.jsx(n,{language:"rust",title:"Chaining iterator methods (like Python's map/filter)",code:`fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Filter and collect — like Python's list comprehension
    let evens: Vec<i32> = numbers.iter()
        .filter(|&&n| n % 2 == 0)
        .cloned()
        .collect();
    println!("Evens: {:?}", evens); // [2, 4, 6, 8, 10]

    // Map — transform each element
    let squared: Vec<i32> = numbers.iter()
        .map(|&n| n * n)
        .collect();
    println!("Squared: {:?}", squared);

    // Chain multiple operations
    let result: i32 = numbers.iter()
        .filter(|&&n| n % 2 == 0)   // keep even numbers
        .map(|&n| n * n)            // square them
        .sum();                     // sum the results
    println!("Sum of even squares: {}", result); // 220

    // Equivalent Python:
    // result = sum(n**2 for n in numbers if n % 2 == 0)
}`}),e.jsx(f,{title:"Loop Practice",difficulty:"intermediate",problem:`Write a Rust program that:

1. Uses a \`for\` loop to find all prime numbers between 2 and 50.
   (Hint: for each candidate n, check if any number from 2 to sqrt(n) divides it evenly)

2. Uses a \`loop\` with break-value to find the first Fibonacci number greater than 1000.

3. Uses iterator methods (.filter(), .map(), .sum()) to compute the sum of squares of all odd numbers from 1 to 20.

4. Uses a labeled loop to find the first pair (i, j) where i*i + j*j == 100, searching i from 0..=10 and j from 0..=10.

Print the results of each.`,solution:`\`\`\`rust
fn main() {
    // 1. Prime numbers from 2 to 50
    print!("Primes: ");
    for n in 2..=50 {
        let mut is_prime = true;
        for d in 2..=((n as f64).sqrt() as i32) {
            if n % d == 0 {
                is_prime = false;
                break;
            }
        }
        if is_prime {
            print!("{} ", n);
        }
    }
    println!();
    // Primes: 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47

    // 2. First Fibonacci > 1000
    let fib = {
        let mut a: u64 = 0;
        let mut b: u64 = 1;
        loop {
            let next = a + b;
            a = b;
            b = next;
            if b > 1000 {
                break b;
            }
        }
    };
    println!("First Fibonacci > 1000: {}", fib); // 1597

    // 3. Sum of squares of odd numbers 1..=20
    let sum: i32 = (1..=20)
        .filter(|n| n % 2 != 0)
        .map(|n| n * n)
        .sum();
    println!("Sum of odd squares: {}", sum); // 1330

    // 4. Find i,j where i^2 + j^2 == 100
    let (ri, rj) = 'outer: {
        for i in 0..=10 {
            for j in 0..=10 {
                if i * i + j * j == 100 {
                    break 'outer (i, j);
                }
            }
        }
        (-1, -1) // not found
    };
    println!("i^2 + j^2 = 100: i={}, j={}", ri, rj); // i=6, j=8
}
\`\`\`

Key takeaways: loop-as-expression with break values is unique to Rust and very useful for search patterns. Iterator methods like .filter().map().sum() are Rust's equivalent of Python's generator expressions and list comprehensions.`})]})}const Z=Object.freeze(Object.defineProperty({__proto__:null,default:F},Symbol.toStringTag,{value:"Module"}));function L(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Pattern Matching with match"}),e.jsxs("p",{children:["Rust's ",e.jsx("code",{children:"match"})," is one of the language's most powerful features. It looks like a switch statement, but it is far more capable: it can destructure enums, tuples, and structs; bind variables; add guard conditions; and the compiler guarantees you have covered every possible case. If you have used Python 3.10's",e.jsx("code",{children:"match"})," statement, Rust's version is the inspiration — but more rigorous."]}),e.jsx(m,{title:"Exhaustive Pattern Matching",children:e.jsxs("p",{children:["The key property of Rust's ",e.jsx("code",{children:"match"})," is ",e.jsx("strong",{children:"exhaustiveness"}),": the compiler requires that every possible value is handled. If you match on an enum with four variants, you must have arms for all four (or use a wildcard). This means you cannot forget to handle a case — the compiler will refuse to compile until you do. This eliminates an entire class of bugs where a new variant is added but not all code paths are updated."]})}),e.jsx("h2",{children:"Basic match"}),e.jsx(a,{title:"Switch/match comparison",description:"Python's match (3.10+) is structurally similar but Rust's is more powerful and exhaustive.",pythonCode:`# Python match (3.10+)
status = 404

match status:
    case 200:
        print("OK")
    case 404:
        print("Not Found")
    case 500:
        print("Server Error")
    case _:
        print(f"Unknown: {status}")

# Older Python: if/elif chains
if status == 200:
    print("OK")
elif status == 404:
    print("Not Found")
else:
    print(f"Unknown: {status}")`,rustCode:`fn main() {
    let status = 404;

    // Rust match — MUST be exhaustive
    match status {
        200 => println!("OK"),
        404 => println!("Not Found"),
        500 => println!("Server Error"),
        _ => println!("Unknown: {}", status),
    }

    // match is an expression — returns a value
    let message = match status {
        200 => "OK",
        404 => "Not Found",
        500 => "Server Error",
        _ => "Unknown",
    };
    println!("{}", message);

    // Without the _ wildcard, the compiler
    // would error: "non-exhaustive patterns"
}`}),e.jsx("h2",{children:"Matching Multiple Values and Ranges"}),e.jsx(n,{language:"rust",title:"Pattern syntax: multiple values, ranges, and bindings",code:`fn main() {
    let code = 403;

    // Multiple values with |
    let category = match code {
        200 | 201 | 202 => "Success",
        301 | 302 => "Redirect",
        400 | 401 | 403 | 404 => "Client Error",
        500 | 502 | 503 => "Server Error",
        _ => "Other",
    };
    println!("{}: {}", code, category);

    // Ranges with ..=
    let score = 85;
    let grade = match score {
        90..=100 => "A",
        80..=89 => "B",
        70..=79 => "C",
        60..=69 => "D",
        0..=59 => "F",
        _ => "Invalid",
    };
    println!("Score {}: {}", score, grade);

    // Binding the matched value with @
    let age = 25;
    match age {
        0..=12 => println!("Child"),
        teen @ 13..=19 => println!("Teenager, age {}", teen),
        adult @ 20..=64 => println!("Adult, age {}", adult),
        senior @ 65.. => println!("Senior, age {}", senior),
        // Note: no _ needed — all u8/i32 values covered
        // by the open-ended range 65..
    }
}`}),e.jsx("h2",{children:"Destructuring in Patterns"}),e.jsxs("p",{children:["This is where ",e.jsx("code",{children:"match"})," truly outshines simple switch statements. You can destructure tuples, enums, and structs directly in match arms, extracting values and binding them to variables."]}),e.jsx(n,{language:"rust",title:"Destructuring tuples and enums",code:`fn main() {
    // Destructure tuples
    let point = (3, -5);
    match point {
        (0, 0) => println!("At origin"),
        (x, 0) => println!("On x-axis at x={}", x),
        (0, y) => println!("On y-axis at y={}", y),
        (x, y) => println!("At ({}, {})", x, y),
    }

    // Destructure Option
    let maybe_name: Option<&str> = Some("Alice");
    match maybe_name {
        Some(name) => println!("Hello, {}!", name),
        None => println!("Hello, stranger!"),
    }

    // Destructure Result
    let parsed: Result<i32, _> = "42".parse();
    match parsed {
        Ok(n) => println!("Parsed: {}", n),
        Err(e) => println!("Error: {}", e),
    }

    // Nested destructuring
    let data: Option<(i32, &str)> = Some((42, "answer"));
    match data {
        Some((n, label)) => println!("{}: {}", label, n),
        None => println!("No data"),
    }
}`}),e.jsxs(r,{type:"pythonista",title:"Python destructuring is more limited",children:["Python 3.10's match can destructure sequences and objects, but it is not exhaustive — the compiler does not verify you covered all cases. Rust's match arms are checked at compile time, which is especially powerful with enums: if you add a new variant later, every ",e.jsx("code",{children:"match"})," on that enum will fail to compile until you handle the new case."]}),e.jsx("h2",{children:"Match Guards"}),e.jsxs("p",{children:["You can add ",e.jsx("code",{children:"if"})," conditions (called guards) to match arms for more precise matching."]}),e.jsx(a,{title:"Match with conditions",description:"Rust match guards add if conditions to pattern arms for precise control.",pythonCode:`# Python 3.10 match with guards
value = 42

match value:
    case x if x < 0:
        print(f"{x} is negative")
    case x if x == 0:
        print("zero")
    case x if x < 100:
        print(f"{x} is small positive")
    case x:
        print(f"{x} is large")

# More commonly in Python, you'd
# just use if/elif
if value < 0:
    print("negative")
elif value == 0:
    print("zero")
elif value < 100:
    print("small positive")
else:
    print("large")`,rustCode:`fn main() {
    let value = 42;

    match value {
        x if x < 0 => {
            println!("{} is negative", x);
        }
        0 => println!("zero"),
        x if x < 100 => {
            println!("{} is small positive", x);
        }
        x => println!("{} is large", x),
    }

    // Guards with destructured values
    let pair = (2, -3);
    match pair {
        (x, y) if x > 0 && y > 0 => {
            println!("Both positive");
        }
        (x, y) if x + y == 0 => {
            println!("Sum is zero");
        }
        _ => println!("Something else"),
    }
}`}),e.jsx("h2",{children:"The _ Wildcard and Ignoring Values"}),e.jsx(n,{language:"rust",title:"Wildcards and ignoring patterns",code:`fn main() {
    let value = 42;

    // _ matches anything and ignores it
    match value {
        1 => println!("one"),
        2 => println!("two"),
        _ => println!("something else"),
    }

    // Ignore parts of a structure
    let point = (3, 5, 7);
    match point {
        (x, _, z) => println!("x={}, z={}", x, z),
    }

    // Ignore with _prefix (suppresses unused warning)
    let _unused_variable = 42;

    // .. to ignore remaining fields
    let numbers = (1, 2, 3, 4, 5);
    match numbers {
        (first, .., last) => {
            println!("first={}, last={}", first, last);
        }
    }
}`}),e.jsx("h2",{children:"Matching with Custom Enums"}),e.jsx(n,{language:"rust",title:"Enums and exhaustive matching",code:`// Define a custom enum
enum Shape {
    Circle(f64),              // radius
    Rectangle(f64, f64),      // width, height
    Triangle(f64, f64, f64),  // three sides
}

fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle(r) => {
            std::f64::consts::PI * r * r
        }
        Shape::Rectangle(w, h) => w * h,
        Shape::Triangle(a, b, c) => {
            // Heron's formula
            let s = (a + b + c) / 2.0;
            (s * (s - a) * (s - b) * (s - c)).sqrt()
        }
        // No _ needed — all variants are covered!
        // If you add a new Shape variant later,
        // this match will fail to compile.
    }
}

fn main() {
    let shapes = vec![
        Shape::Circle(5.0),
        Shape::Rectangle(4.0, 6.0),
        Shape::Triangle(3.0, 4.0, 5.0),
    ];

    for shape in &shapes {
        println!("Area: {:.2}", area(shape));
    }
}`}),e.jsxs(r,{type:"warning",title:"Exhaustiveness catches bugs at compile time",children:["If you add a new variant to an enum (say, ",e.jsx("code",{children:"Shape::Pentagon"}),"), every",e.jsx("code",{children:"match"})," expression on ",e.jsx("code",{children:"Shape"})," will immediately produce a compiler error until you handle the new case. This is one of Rust's strongest safety guarantees and is why experienced Rust developers prefer ",e.jsx("code",{children:"match"}),"over chains of ",e.jsx("code",{children:"if/else"})," when working with enums."]}),e.jsx(f,{title:"Pattern Matching Practice",difficulty:"intermediate",problem:`Create an enum called \`Command\` with these variants:

- \`Quit\` (no data)
- \`Echo(String)\` (a message to print)
- \`Move { x: i32, y: i32 }\` (a struct variant with coordinates)
- \`Color(u8, u8, u8)\` (RGB values)

Write a function \`process_command\` that uses match to handle each variant:
- Quit: print "Shutting down"
- Echo: print the message
- Move: print "Moving to (x, y)" — add a guard that prints "Out of bounds!" if x or y is greater than 100
- Color: print the color as hex format "#RRGGBB"

In main, create a Vec of commands and process each one.`,solution:`\`\`\`rust
enum Command {
    Quit,
    Echo(String),
    Move { x: i32, y: i32 },
    Color(u8, u8, u8),
}

fn process_command(cmd: &Command) {
    match cmd {
        Command::Quit => println!("Shutting down"),
        Command::Echo(msg) => println!("{}", msg),
        Command::Move { x, y } if *x > 100 || *y > 100 => {
            println!("Out of bounds! ({}, {})", x, y);
        }
        Command::Move { x, y } => {
            println!("Moving to ({}, {})", x, y);
        }
        Command::Color(r, g, b) => {
            println!("#{:02x}{:02x}{:02x}", r, g, b);
        }
    }
}

fn main() {
    let commands = vec![
        Command::Echo(String::from("Hello, Rust!")),
        Command::Move { x: 10, y: 20 },
        Command::Move { x: 150, y: 50 },
        Command::Color(255, 128, 0),
        Command::Quit,
    ];

    for cmd in &commands {
        process_command(cmd);
    }
}
\`\`\`

Output:
\`\`\`
Hello, Rust!
Moving to (10, 20)
Out of bounds! (150, 50)
#ff8000
Shutting down
\`\`\`

Note how the guard arm for Move must come BEFORE the general Move arm — Rust checks arms in order. The compiler verifies all four variants are handled.`})]})}const Q=Object.freeze(Object.defineProperty({__proto__:null,default:L},Symbol.toStringTag,{value:"Module"}));function W(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Function Signatures & Return Types"}),e.jsx("p",{children:"Functions in Rust look similar to Python but with one critical difference: every parameter and return type must be explicitly annotated. This might feel verbose at first, but it is actually a feature — the function signature becomes a contract that both the compiler and other developers can rely on. You never have to guess what a function accepts or returns."}),e.jsx(m,{title:"Function Signatures Are Contracts",children:e.jsx("p",{children:"In Python, a function signature tells you parameter names but not their types (unless you add optional annotations). In Rust, the function signature is a complete contract: it specifies exactly what types go in and what type comes out. The compiler enforces this contract at every call site. This means you can read a function signature and know exactly how to use it — no documentation or source reading required."})}),e.jsx("h2",{children:"Basic Function Syntax"}),e.jsx(a,{title:"Function declaration",description:"Rust uses fn instead of def, requires type annotations, and uses -> for return types.",pythonCode:`# Python: def, optional type hints
def greet(name: str) -> str:
    return f"Hello, {name}!"

# Without type hints (still valid)
def add(a, b):
    return a + b

# Multiple parameters
def describe(name, age, active=True):
    status = "active" if active else "inactive"
    return f"{name}, age {age}, {status}"

print(greet("Alice"))
print(add(2, 3))
print(describe("Bob", 30))`,rustCode:`// Rust: fn, required type annotations
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

// Types are ALWAYS required
fn add(a: i32, b: i32) -> i32 {
    a + b
}

// Multiple parameters (no defaults)
fn describe(name: &str, age: u32, active: bool) -> String {
    let status = if active { "active" } else { "inactive" };
    format!("{}, age {}, {}", name, age, status)
}

fn main() {
    println!("{}", greet("Alice"));
    println!("{}", add(2, 3));
    println!("{}", describe("Bob", 30, true));
}`}),e.jsxs(r,{type:"pythonista",title:"No default parameters in Rust",children:["Rust does not have default parameter values like Python's ",e.jsx("code",{children:"def f(x=10)"}),". Instead, you use the builder pattern or ",e.jsx("code",{children:"Option<T>"})," parameters. This is intentional — default values can make function calls ambiguous, especially in a statically-typed language."]}),e.jsx("h2",{children:"Return Values: The Last Expression"}),e.jsxs("p",{children:["Rust has a unique feature: the last expression in a function body (without a semicolon) is automatically the return value. You do not need the ",e.jsx("code",{children:"return"}),"keyword unless you want to return early."]}),e.jsx(n,{language:"rust",title:"Expression-based returns",code:`// The last expression is the return value
fn square(x: i32) -> i32 {
    x * x    // no semicolon = this is the return value
}

// WRONG: semicolon turns it into a statement
// fn square_wrong(x: i32) -> i32 {
//     x * x;   // semicolon makes this return () not i32
// }             // ERROR: expected i32, found ()

// Using 'return' for early returns
fn absolute_value(x: i32) -> i32 {
    if x < 0 {
        return -x;   // early return
    }
    x   // final expression (no return needed)
}

// Complex expressions as return values
fn classify(score: i32) -> &'static str {
    if score >= 90 { "excellent" }
    else if score >= 70 { "good" }
    else if score >= 50 { "average" }
    else { "needs improvement" }
}

fn main() {
    println!("{}", square(5));          // 25
    println!("{}", absolute_value(-7)); // 7
    println!("{}", classify(85));       // good
}`}),e.jsxs(r,{type:"warning",title:"The semicolon trap",children:["This is a common gotcha for beginners: adding a semicolon to the last line of a function turns it from an expression (returns a value) into a statement (returns ",e.jsx("code",{children:"()"}),`, Rust's unit type). If you see an error like "expected i32, found ()", check whether you accidentally added a semicolon to your return expression.`]}),e.jsx("h2",{children:"Functions That Return Nothing"}),e.jsx(a,{title:"Void/None returns",description:"Python functions return None by default. Rust functions return () (unit) by default.",pythonCode:`# Python: returns None implicitly
def log(message: str) -> None:
    print(f"LOG: {message}")

# Or without annotation (same behavior)
def log2(message):
    print(f"LOG: {message}")

result = log("hello")
print(result)  # None
print(type(result))  # <class 'NoneType'>`,rustCode:`// Rust: returns () implicitly
fn log(message: &str) {
    println!("LOG: {}", message);
}

// Explicit () return type (same thing)
fn log2(message: &str) -> () {
    println!("LOG: {}", message);
}

fn main() {
    log("hello");
    let result = log("test");
    println!("{:?}", result); // ()
    // () is the "unit" type — like None
    // but it's a type, not a value
}`}),e.jsx("h2",{children:"Multiple Return Values"}),e.jsx(n,{language:"rust",title:"Returning multiple values with tuples",code:`// Return a tuple (like Python's multiple return)
fn min_max(values: &[i32]) -> (i32, i32) {
    let mut min = values[0];
    let mut max = values[0];
    for &v in &values[1..] {
        if v < min { min = v; }
        if v > max { max = v; }
    }
    (min, max)  // return a tuple
}

// Return a named struct for clarity
struct Stats {
    mean: f64,
    count: usize,
    sum: f64,
}

fn compute_stats(values: &[f64]) -> Stats {
    let count = values.len();
    let sum: f64 = values.iter().sum();
    let mean = sum / count as f64;
    Stats { mean, count, sum }
}

fn main() {
    let data = vec![3, 1, 4, 1, 5, 9, 2, 6];
    let (min, max) = min_max(&data); // destructure the tuple
    println!("Min: {}, Max: {}", min, max);

    let float_data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
    let stats = compute_stats(&float_data);
    println!("Mean: {:.1}, Count: {}, Sum: {:.1}",
        stats.mean, stats.count, stats.sum);
}`}),e.jsx("h2",{children:"Functions as Documentation"}),e.jsx(a,{title:"Self-documenting function signatures",description:"Rust signatures convey more information than Python signatures, even with type hints.",pythonCode:`# Python: type hints help but aren't enforced
def process_data(
    data: list[float],
    threshold: float = 0.5,
    normalize: bool = True
) -> tuple[list[float], int]:
    """Process data, returning (results, count).

    Might raise ValueError if data is empty.
    Might return None if... wait, the type
    hint says tuple, but does it really?
    """
    if not data:
        raise ValueError("Empty data")
    results = [x for x in data if x > threshold]
    if normalize:
        mx = max(results) if results else 1
        results = [x / mx for x in results]
    return results, len(results)`,rustCode:`/// Process data, returning (results, count).
///
/// Returns an error if the input slice
/// is empty.
fn process_data(
    data: &[f64],
    threshold: f64,
    normalize: bool,
) -> Result<(Vec<f64>, usize), String> {
    if data.is_empty() {
        return Err("Empty data".to_string());
    }
    let mut results: Vec<f64> = data.iter()
        .filter(|&&x| x > threshold)
        .cloned()
        .collect();
    if normalize {
        let mx = results.iter()
            .cloned()
            .fold(f64::MIN, f64::max);
        for x in results.iter_mut() {
            *x /= mx;
        }
    }
    let count = results.len();
    Ok((results, count))
}

fn main() {
    match process_data(&[1.0, 2.0, 3.0], 1.5, true) {
        Ok((results, count)) => {
            println!("{:?} ({})", results, count);
        }
        Err(e) => println!("Error: {}", e),
    }
}`}),e.jsx(r,{type:"tip",title:"Read the signature, know the contract",children:"The Rust function signature tells you everything: it takes a borrowed slice of f64s (won't consume your data), a threshold, a flag, and returns either a success tuple or an error string. There is no possibility of it returning None, panicking unexpectedly, or modifying your input. The type system encodes what Python puts in docstrings and hopes developers read."}),e.jsx(f,{title:"Function Writing Practice",difficulty:"intermediate",problem:`Write the following Rust functions:

1. \`fn is_palindrome(s: &str) -> bool\` — returns true if a string reads the same forwards and backwards (ignore case). Example: "Racecar" → true.

2. \`fn fizzbuzz(n: u32) -> String\` — returns "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, or the number as a string otherwise.

3. \`fn statistics(data: &[f64]) -> (f64, f64, f64)\` — returns (min, max, mean) of a slice. Use the last-expression-as-return pattern (no return keyword).

4. \`fn safe_divide(a: f64, b: f64) -> Result<f64, String>\` — returns Ok(a/b) or Err if b is zero.

Test each function in main() with at least 2 inputs.`,solution:`\`\`\`rust
fn is_palindrome(s: &str) -> bool {
    let lower = s.to_lowercase();
    let chars: Vec<char> = lower.chars().collect();
    let len = chars.len();
    for i in 0..len / 2 {
        if chars[i] != chars[len - 1 - i] {
            return false;
        }
    }
    true
}

fn fizzbuzz(n: u32) -> String {
    match (n % 3, n % 5) {
        (0, 0) => String::from("FizzBuzz"),
        (0, _) => String::from("Fizz"),
        (_, 0) => String::from("Buzz"),
        _ => n.to_string(),
    }
}

fn statistics(data: &[f64]) -> (f64, f64, f64) {
    let min = data.iter().cloned().fold(f64::INFINITY, f64::min);
    let max = data.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    let mean = data.iter().sum::<f64>() / data.len() as f64;
    (min, max, mean)
}

fn safe_divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Division by zero"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    println!("{}", is_palindrome("Racecar")); // true
    println!("{}", is_palindrome("hello"));   // false

    for i in 1..=15 {
        println!("{}: {}", i, fizzbuzz(i));
    }

    let data = vec![2.0, 7.0, 1.0, 8.0, 3.0];
    let (min, max, mean) = statistics(&data);
    println!("min={}, max={}, mean={:.1}", min, max, mean);

    println!("{:?}", safe_divide(10.0, 3.0));  // Ok(3.333...)
    println!("{:?}", safe_divide(10.0, 0.0));  // Err("Division by zero")
}
\`\`\`

Key points: fizzbuzz uses match on a tuple for clean pattern matching. statistics returns all three values without the return keyword. safe_divide uses Result to make the error case explicit in the type system.`})]})}const J=Object.freeze(Object.defineProperty({__proto__:null,default:W},Symbol.toStringTag,{value:"Module"}));function V(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Closures"}),e.jsxs("p",{children:["Closures are anonymous functions that can capture variables from their surrounding scope. If you have used Python's ",e.jsx("code",{children:"lambda"})," or passed functions to",e.jsx("code",{children:"map()"}),", ",e.jsx("code",{children:"filter()"}),", and ",e.jsx("code",{children:"sorted()"}),", you already understand the concept. Rust closures are more powerful than Python's lambdas: they can have multiple statements, capture variables by reference or by value, and the compiler infers their types."]}),e.jsx(m,{title:"Closures vs Functions",children:e.jsxs("p",{children:["A closure is a function-like value that can capture variables from the scope where it is defined. In Rust, closures use ",e.jsx("code",{children:"|params| expression"}),"syntax (pipes instead of parentheses). Unlike regular ",e.jsx("code",{children:"fn"})," functions, closures can access local variables from their enclosing scope without passing them as parameters. The compiler infers parameter and return types from usage, so you rarely need type annotations."]})}),e.jsx("h2",{children:"Basic Closure Syntax"}),e.jsx(a,{title:"Closure syntax",description:"Rust closures use |args| body syntax. They are more capable than Python's single-expression lambdas.",pythonCode:`# Python lambda: single expression only
square = lambda x: x * x
print(square(5))  # 25

# For multi-line, you need a def
def process(x):
    result = x * 2
    result += 1
    return result

print(process(5))  # 11

# Lambdas used with higher-order functions
numbers = [3, 1, 4, 1, 5, 9]
sorted_nums = sorted(numbers, key=lambda x: -x)
print(sorted_nums)  # [9, 5, 4, 3, 1, 1]

evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [4]`,rustCode:`fn main() {
    // Rust closure: can be multi-line
    let square = |x: i32| x * x;
    println!("{}", square(5)); // 25

    // Multi-statement closure with braces
    let process = |x: i32| {
        let result = x * 2;
        result + 1  // last expression = return
    };
    println!("{}", process(5)); // 11

    // Type inference — often no annotations
    let add = |a, b| a + b;
    println!("{}", add(3, 4)); // 7

    // With higher-order methods
    let mut numbers = vec![3, 1, 4, 1, 5, 9];
    numbers.sort_by_key(|&x| std::cmp::Reverse(x));
    println!("{:?}", numbers); // [9, 5, 4, 3, 1, 1]

    let evens: Vec<&i32> = numbers.iter()
        .filter(|&&x| x % 2 == 0)
        .collect();
    println!("{:?}", evens); // [4]
}`}),e.jsxs(r,{type:"pythonista",title:"Closures are not limited to one expression",children:["Python's ",e.jsx("code",{children:"lambda"})," can only contain a single expression, which is why you often need to use ",e.jsx("code",{children:"def"})," for anything complex. Rust closures have no such limitation — they can contain any number of statements, loops, match expressions, and more. They are full anonymous functions."]}),e.jsx("h2",{children:"Capturing Variables from the Environment"}),e.jsx("p",{children:"The defining feature of closures is their ability to capture variables from the enclosing scope. Rust gives you fine-grained control over how variables are captured, tied to the ownership system."}),e.jsx(n,{language:"rust",title:"Closures capture variables from their environment",code:`fn main() {
    // Capture by immutable reference (most common)
    let name = String::from("Alice");
    let greet = || println!("Hello, {}!", name);
    greet();          // Hello, Alice!
    println!("{}", name); // name still usable

    // Capture by mutable reference
    let mut count = 0;
    let mut increment = || {
        count += 1;  // borrows count mutably
        println!("Count: {}", count);
    };
    increment(); // Count: 1
    increment(); // Count: 2
    // Can't use 'count' while 'increment' exists
    // and has a mutable borrow
    drop(increment); // explicitly drop the closure
    println!("Final count: {}", count); // 3... wait, 2

    // Capture by value with 'move'
    let data = vec![1, 2, 3];
    let print_data = move || {
        println!("{:?}", data); // data moved INTO closure
    };
    print_data(); // [1, 2, 3]
    // println!("{:?}", data); // ERROR: data was moved
}`}),e.jsxs(r,{type:"note",title:"The three capture modes",children:["Rust closures capture variables in three ways, and the compiler automatically picks the least restrictive mode:",e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"&T (immutable borrow):"})," closure reads but doesn't modify the variable"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"&mut T (mutable borrow):"})," closure modifies the variable"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"T (move/take ownership):"})," closure takes ownership of the variable — use ",e.jsx("code",{children:"move"})," keyword to force this"]})]})]}),e.jsx("h2",{children:"Closures as Function Arguments"}),e.jsxs("p",{children:["Closures shine when passed to higher-order functions — functions that accept other functions as arguments. This is the Rust equivalent of Python's",e.jsx("code",{children:"map()"}),", ",e.jsx("code",{children:"filter()"}),", ",e.jsx("code",{children:"sorted(key=...)"})," pattern."]}),e.jsx(a,{title:"Higher-order functions",description:"Both languages pass functions/closures as arguments, but Rust's iterator methods are zero-cost.",pythonCode:`# Python: pass functions to built-ins
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map
doubled = list(map(lambda x: x * 2, numbers))

# filter
evens = list(filter(lambda x: x % 2 == 0, numbers))

# sorted with key function
words = ["banana", "apple", "cherry"]
by_length = sorted(words, key=lambda w: len(w))

# Custom higher-order function
def apply_twice(f, x):
    return f(f(x))

result = apply_twice(lambda x: x + 1, 5)
print(result)  # 7`,rustCode:`fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // map
    let doubled: Vec<i32> = numbers.iter()
        .map(|&x| x * 2).collect();

    // filter
    let evens: Vec<&i32> = numbers.iter()
        .filter(|&&x| x % 2 == 0).collect();

    // sort with closure
    let mut words = vec!["banana", "apple", "cherry"];
    words.sort_by_key(|w| w.len());

    // Custom higher-order function
    fn apply_twice(f: impl Fn(i32) -> i32, x: i32) -> i32 {
        f(f(x))
    }

    let result = apply_twice(|x| x + 1, 5);
    println!("{}", result); // 7

    println!("{:?}", doubled);
    println!("{:?}", evens);
    println!("{:?}", words);
}`}),e.jsx("h2",{children:"Closure Traits: Fn, FnMut, FnOnce"}),e.jsx(n,{language:"rust",title:"The three closure traits",code:`// Fn — borrows captured values immutably
// Can be called multiple times, doesn't modify captures
fn apply_fn(f: impl Fn(i32) -> i32, x: i32) -> i32 {
    f(x)
}

// FnMut — borrows captured values mutably
// Can be called multiple times, may modify captures
fn apply_n_times(mut f: impl FnMut(), n: usize) {
    for _ in 0..n {
        f();
    }
}

// FnOnce — takes ownership of captured values
// Can only be called once (consumes the closure)
fn consume(f: impl FnOnce() -> String) -> String {
    f()
}

fn main() {
    // Fn example
    let multiplier = 3;
    let triple = |x| x * multiplier; // borrows multiplier
    println!("{}", apply_fn(triple, 5)); // 15
    println!("{}", apply_fn(triple, 10)); // 30

    // FnMut example
    let mut total = 0;
    let mut accumulate = || { total += 1; };
    apply_n_times(&mut accumulate, 5);
    drop(accumulate);
    println!("Total: {}", total); // 5

    // FnOnce example
    let name = String::from("Alice");
    let make_greeting = move || {
        format!("Hello, {}!", name) // takes ownership of name
    };
    println!("{}", consume(make_greeting));
    // make_greeting can't be called again — it was consumed
}`}),e.jsxs(r,{type:"tip",title:"Choosing Fn vs FnMut vs FnOnce",children:["When writing functions that accept closures, prefer the least restrictive trait: use ",e.jsx("code",{children:"Fn"})," when possible (most flexible for callers), ",e.jsx("code",{children:"FnMut"}),"if the closure needs to mutate state, and ",e.jsx("code",{children:"FnOnce"})," only if it must consume captured values. In practice, most iterator methods use ",e.jsx("code",{children:"FnMut"}),"because it covers both Fn and mutating closures."]}),e.jsx("h2",{children:"Closures with Iterators — Practical Patterns"}),e.jsx(n,{language:"rust",title:"Common closure + iterator patterns for data work",code:`fn main() {
    let data = vec![
        ("Alice", 92.0),
        ("Bob", 87.5),
        ("Charlie", 95.0),
        ("Diana", 78.0),
        ("Eve", 91.0),
    ];

    // Filter and transform
    let honor_roll: Vec<&str> = data.iter()
        .filter(|(_, score)| *score >= 90.0)
        .map(|(name, _)| *name)
        .collect();
    println!("Honor roll: {:?}", honor_roll);

    // Find first match
    let first_a = data.iter()
        .find(|(_, score)| *score >= 90.0);
    println!("First A student: {:?}", first_a);

    // Check conditions
    let all_passing = data.iter().all(|(_, s)| *s >= 60.0);
    let any_perfect = data.iter().any(|(_, s)| *s == 100.0);
    println!("All passing: {}, Any perfect: {}", all_passing, any_perfect);

    // Fold (reduce) — like Python's functools.reduce
    let total: f64 = data.iter()
        .map(|(_, score)| score)
        .fold(0.0, |acc, &s| acc + s);
    let average = total / data.len() as f64;
    println!("Average score: {:.1}", average);

    // Count with predicate
    let a_count = data.iter()
        .filter(|(_, s)| *s >= 90.0)
        .count();
    println!("Number of A grades: {}", a_count);
}`}),e.jsx(f,{title:"Closure Practice",difficulty:"intermediate",problem:`Write a Rust program that demonstrates closures:

1. Create a closure \`make_adder\` that takes an i32 and returns a closure that adds that number to its argument. Usage: \`let add5 = make_adder(5); println!("{}", add5(3));\` should print 8.

2. Given a Vec<String> of words, use iterator methods with closures to:
   a. Filter words longer than 4 characters
   b. Convert them to uppercase
   c. Collect into a new Vec<String>

3. Create a closure that captures a mutable Vec and provides a \`push\` operation. Use it to add 5 numbers, then print the vector.

4. Use .fold() with a closure to compute the product of all numbers in a vector [1, 2, 3, 4, 5].`,solution:`\`\`\`rust
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

fn main() {
    // 1. Closure factory
    let add5 = make_adder(5);
    let add10 = make_adder(10);
    println!("add5(3) = {}", add5(3));   // 8
    println!("add10(3) = {}", add10(3)); // 13

    // 2. Filter, transform, collect
    let words = vec![
        String::from("hi"),
        String::from("hello"),
        String::from("hey"),
        String::from("greetings"),
        String::from("yo"),
        String::from("welcome"),
    ];

    let long_upper: Vec<String> = words.iter()
        .filter(|w| w.len() > 4)
        .map(|w| w.to_uppercase())
        .collect();
    println!("Long words: {:?}", long_upper);
    // ["HELLO", "GREETINGS", "WELCOME"]

    // 3. Mutable capture
    let mut collected = Vec::new();
    {
        let mut push = |x: i32| collected.push(x);
        for i in 1..=5 {
            push(i * 10);
        }
    } // mutable borrow ends here
    println!("Collected: {:?}", collected);
    // [10, 20, 30, 40, 50]

    // 4. Fold to compute product
    let numbers = vec![1, 2, 3, 4, 5];
    let product = numbers.iter().fold(1, |acc, &x| acc * x);
    println!("Product: {}", product); // 120
}
\`\`\`

Key points: \`make_adder\` returns \`impl Fn(i32) -> i32\` and uses \`move\` to take ownership of \`n\`. The mutable capture in #3 requires a limited scope so the borrow ends before we print the vector. \`.fold()\` is Rust's equivalent of Python's \`functools.reduce()\`.`})]})}const ee=Object.freeze(Object.defineProperty({__proto__:null,default:V},Symbol.toStringTag,{value:"Module"}));function H(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Modules & Crates"}),e.jsxs("p",{children:["Rust's module system organizes code into hierarchical namespaces, controls visibility (public vs private), and manages external dependencies. If you are coming from Python, the concepts map reasonably well: Rust modules are like Python modules, crates are like Python packages, and ",e.jsx("code",{children:"use"})," is like",e.jsx("code",{children:"import"}),". The key differences are explicit visibility (everything is private by default) and the way modules are declared."]}),e.jsxs(m,{title:"Crates and Modules",children:[e.jsx("p",{children:"Rust code organization has two levels:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Crate:"})," The top-level compilation unit — either a binary (has ",e.jsx("code",{children:"main.rs"}),") or a library (has ",e.jsx("code",{children:"lib.rs"}),"). A crate is like a Python package that you install with pip. Crates are published to ",e.jsx("a",{href:"https://crates.io",children:"crates.io"})," (Rust's PyPI)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Module:"})," A namespace within a crate that groups related code. Modules can be nested. A module is like a Python module file or a sub-package directory."]})]}),e.jsxs("p",{children:["Everything in Rust is ",e.jsx("strong",{children:"private by default"}),". You must use",e.jsx("code",{children:"pub"})," to make items visible outside their module. This is the opposite of Python, where everything is public unless prefixed with ",e.jsx("code",{children:"_"}),"."]})]}),e.jsx("h2",{children:"Defining Modules"}),e.jsx(a,{title:"Module structure",description:"Python uses files and directories with __init__.py. Rust uses the mod keyword and file naming conventions.",pythonCode:`# Python: file = module, directory = package

# my_project/
# ├── __init__.py
# ├── math_utils.py
# ├── data/
# │   ├── __init__.py
# │   ├── loader.py
# │   └── processor.py

# math_utils.py
def add(a, b):
    return a + b

def _helper():  # "private" by convention
    pass

# data/loader.py
def load_csv(path):
    ...

# main.py
from math_utils import add
from data.loader import load_csv`,rustCode:`// Rust: mod declares modules

// src/
// ├── main.rs
// ├── math_utils.rs
// ├── data/
// │   ├── mod.rs
// │   ├── loader.rs
// │   └── processor.rs

// math_utils.rs
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn helper() { } // private (no pub)

// data/loader.rs
pub fn load_csv(path: &str) {
    println!("Loading {}", path);
}

// main.rs
mod math_utils;   // declares module
mod data;         // declares module

use math_utils::add;
use data::loader::load_csv;

fn main() {
    println!("{}", add(2, 3));
    load_csv("data.csv");
}`}),e.jsxs(r,{type:"pythonista",title:"mod declares, use imports",children:["In Python, ",e.jsx("code",{children:"import"})," both finds the module and brings names into scope. Rust splits this into two steps: ",e.jsx("code",{children:"mod math_utils;"})," tells the compiler this module exists (and where to find its file), and ",e.jsx("code",{children:"use math_utils::add;"}),"brings the name into the current scope. The ",e.jsx("code",{children:"mod"})," declaration is needed once (usually in ",e.jsx("code",{children:"main.rs"})," or ",e.jsx("code",{children:"lib.rs"}),"), while",e.jsx("code",{children:"use"})," is used wherever you need the item."]}),e.jsx("h2",{children:"Visibility with pub"}),e.jsx(n,{language:"rust",title:"Public vs private items",code:`// Everything is private by default in Rust
mod authentication {
    // Public function — accessible from outside the module
    pub fn login(username: &str, password: &str) -> bool {
        let hashed = hash_password(password); // can call private fn
        validate(username, &hashed)
    }

    // Private function — only accessible within this module
    fn hash_password(password: &str) -> String {
        format!("hashed_{}", password) // simplified
    }

    fn validate(username: &str, hashed: &str) -> bool {
        username == "admin" && hashed == "hashed_secret"
    }

    // Public struct with mixed visibility fields
    pub struct User {
        pub name: String,      // public field
        pub email: String,     // public field
        password_hash: String, // private field!
    }

    impl User {
        // Public constructor (needed because password_hash is private)
        pub fn new(name: &str, email: &str, password: &str) -> User {
            User {
                name: name.to_string(),
                email: email.to_string(),
                password_hash: hash_password(password),
            }
        }
    }
}

fn main() {
    let success = authentication::login("admin", "secret");
    println!("Login: {}", success);

    // authentication::hash_password("x"); // ERROR: private
    // authentication::validate("x", "y"); // ERROR: private

    let user = authentication::User::new("Alice", "alice@example.com", "pass123");
    println!("User: {}", user.name);      // OK: pub field
    // println!("{}", user.password_hash); // ERROR: private field
}`}),e.jsx("h2",{children:"The use Keyword"}),e.jsx(a,{title:"Import syntax",description:"Rust's use is similar to Python's from...import with some additional features.",pythonCode:`# Python imports
import os
import os.path
from os.path import join, exists
from collections import (
    OrderedDict,
    defaultdict,
    Counter,
)

# Alias
import numpy as np
from typing import List as L

# Relative imports
from . import sibling_module
from ..parent import something`,rustCode:`// Rust use statements
use std::fs;
use std::path::Path;
use std::path::{PathBuf, Path};
use std::collections::{
    HashMap,
    HashSet,
    BTreeMap,
};

// Alias
use std::collections::HashMap as Map;
use std::io::Result as IoResult;

// Glob import (use sparingly)
use std::collections::*;

// Nested paths
use std::{
    fs::File,
    io::{self, Read, Write},
    path::Path,
};

// Re-export (pub use)
pub use self::internal::PublicApi;`}),e.jsx("h2",{children:"File Structure for Modules"}),e.jsx(n,{language:"rust",title:"Two conventions for module files",code:`// Convention 1: mod.rs (older style)
// src/
// ├── main.rs
// └── data/
//     ├── mod.rs         ← declares sub-modules
//     ├── loader.rs
//     └── processor.rs

// data/mod.rs:
pub mod loader;
pub mod processor;

// Convention 2: named file (modern style, Rust 2018+)
// src/
// ├── main.rs
// ├── data.rs            ← declares sub-modules
// └── data/
//     ├── loader.rs
//     └── processor.rs

// data.rs:
pub mod loader;
pub mod processor;

// Both work the same way.
// The modern style (data.rs + data/) is preferred
// for new projects.

// In main.rs (same for both):
mod data;

use data::loader::load_csv;
use data::processor::process;

fn main() {
    load_csv("input.csv");
    process();
}`}),e.jsxs(r,{type:"tip",title:"Start simple, organize later",children:["For small projects, you can define modules inline in ",e.jsx("code",{children:"main.rs"})," using",e.jsxs("code",{children:["mod my_module ","{ ... }"]}),". As your project grows, extract modules into separate files. This is similar to starting with everything in one Python file and splitting into a package as it grows."]}),e.jsx("h2",{children:"External Crates (Dependencies)"}),e.jsx(n,{language:"toml",title:"Adding dependencies in Cargo.toml",code:`# Cargo.toml — add external crates here
[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
reqwest = { version = "0.12", features = ["json"] }
tokio = { version = "1", features = ["full"] }
rand = "0.8"

# Add via command line:
# cargo add serde --features derive
# cargo add rand`}),e.jsx(n,{language:"rust",title:"Using external crates",code:`// After adding to Cargo.toml, just 'use' them
use rand::Rng;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct DataPoint {
    x: f64,
    y: f64,
    label: String,
}

fn main() {
    // Using the rand crate
    let mut rng = rand::thread_rng();
    let random_number: f64 = rng.gen_range(0.0..1.0);
    println!("Random: {:.4}", random_number);

    // Using serde for JSON serialization
    let point = DataPoint {
        x: 1.5,
        y: 2.7,
        label: String::from("sample"),
    };
    let json = serde_json::to_string_pretty(&point).unwrap();
    println!("{}", json);

    // Deserialize back
    let parsed: DataPoint = serde_json::from_str(&json).unwrap();
    println!("Parsed: {:?}", parsed);
}`}),e.jsx("h2",{children:"Crate Structure: lib.rs vs main.rs"}),e.jsx(a,{title:"Library vs executable",description:"Rust projects can be a library, a binary, or both — controlled by which entry files exist.",pythonCode:`# Python: any module can be both importable
# and executable

# my_package/__init__.py
def useful_function():
    return 42

# my_package/__main__.py
# (or: if __name__ == "__main__":)
from . import useful_function
print(useful_function())

# Can be:
# python -m my_package  (runs __main__)
# import my_package     (uses as library)`,rustCode:`// Rust: separate entry points

// src/lib.rs — library entry point
pub fn useful_function() -> i32 {
    42
}

pub mod helpers {
    pub fn format_number(n: i32) -> String {
        format!("The number is {}", n)
    }
}

// src/main.rs — binary entry point
// Imports from the library part of the
// same crate
use my_crate::useful_function;
use my_crate::helpers::format_number;

fn main() {
    let n = useful_function();
    println!("{}", format_number(n));
}

// Having both lib.rs and main.rs means
// your crate is both a library AND a binary.
// Others can depend on the library part.`}),e.jsxs(r,{type:"note",title:"The prelude — what's available without use",children:['Rust automatically imports a small set of very common items into every module (the "prelude"): ',e.jsx("code",{children:"Option"}),", ",e.jsx("code",{children:"Result"}),",",e.jsx("code",{children:"Vec"}),", ",e.jsx("code",{children:"String"}),", ",e.jsx("code",{children:"Box"}),", common traits like",e.jsx("code",{children:"Clone"}),", ",e.jsx("code",{children:"Copy"}),", ",e.jsx("code",{children:"Iterator"}),", and more. This is why you can use ",e.jsx("code",{children:"Vec::new()"})," or ",e.jsx("code",{children:"Some(42)"})," without any ",e.jsx("code",{children:"use"})," statement. Everything else requires an explicit import."]}),e.jsx(f,{title:"Module Organization Practice",difficulty:"intermediate",problem:"Design a Rust project structure for a simple data analysis tool. Sketch out (in comments or code) the following:\n\n1. A module `stats` with public functions:\n   - `mean(data: &[f64]) -> f64`\n   - `median(data: &mut Vec<f64>) -> f64`\n   - `std_dev(data: &[f64]) -> f64`\n   And a private helper function `variance(data: &[f64]) -> f64`\n\n2. A module `io` with a sub-module `csv` containing:\n   - `pub fn read_column(path: &str, col: usize) -> Vec<f64>`\n\n3. A `main.rs` that uses both modules.\n\nWrite the actual code for the `stats` module (with the functions implemented). For the `io` module, write the structure with placeholder implementations.\n\nInclude the file/directory layout as comments.",solution:`\`\`\`rust
// File structure:
// src/
// ├── main.rs
// ├── stats.rs
// ├── io.rs
// └── io/
//     └── csv.rs

// === src/stats.rs ===
pub fn mean(data: &[f64]) -> f64 {
    if data.is_empty() {
        return 0.0;
    }
    data.iter().sum::<f64>() / data.len() as f64
}

pub fn median(data: &mut Vec<f64>) -> f64 {
    data.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let len = data.len();
    if len == 0 {
        return 0.0;
    }
    if len % 2 == 0 {
        (data[len / 2 - 1] + data[len / 2]) / 2.0
    } else {
        data[len / 2]
    }
}

pub fn std_dev(data: &[f64]) -> f64 {
    variance(data).sqrt()
}

fn variance(data: &[f64]) -> f64 {
    let avg = mean(data);
    data.iter()
        .map(|x| (x - avg).powi(2))
        .sum::<f64>() / data.len() as f64
}

// === src/io.rs ===
pub mod csv;

// === src/io/csv.rs ===
pub fn read_column(_path: &str, _col: usize) -> Vec<f64> {
    // Placeholder implementation
    vec![1.0, 2.0, 3.0, 4.0, 5.0]
}

// === src/main.rs ===
mod stats;
mod io;

use stats::{mean, median, std_dev};
use io::csv::read_column;

fn main() {
    let mut data = read_column("data.csv", 0);
    println!("Mean: {:.2}", mean(&data));
    println!("Median: {:.2}", median(&mut data));
    println!("Std Dev: {:.2}", std_dev(&data));
    // variance is private — can't call stats::variance()
}
\`\`\`

Key points: \`variance\` has no \`pub\` keyword so it's only callable within the \`stats\` module. The \`io\` module uses the modern file convention (io.rs + io/ directory). Sub-modules must be declared with \`pub mod\` in their parent to be accessible from outside.`})]})}const te=Object.freeze(Object.defineProperty({__proto__:null,default:H},Symbol.toStringTag,{value:"Module"}));export{m as C,f as E,r as N,a as P,n as a,D as b,Y as c,G as d,K as e,$ as f,X as g,Z as h,Q as i,J as j,ee as k,te as l,q as s};
