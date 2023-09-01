import hljs from 'highlight.js/lib/core';
import {solidity} from 'highlightjs-solidity';
hljs.registerLanguage('solidity',solidity);

export default hljs;