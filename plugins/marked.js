import marked from 'marked'
import Hljs from './highlight'

const languages = [
  'cpp',
  'xml',
  'bash',
  'coffeescript',
  'css',
  'markdown',
  'http',
  'java',
  'javascript',
  'json',
  'less',
  'makefile',
  'nginx',
  'php',
  'python',
  'scss',
  'sql',
  'stylus'
]

const renderer = new marked.Renderer()

marked.setOptions({
  renderer,
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  // sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight(code, lang) {
    if (!~languages.indexOf(lang)) {
      return Hljs.highlightAuto(code).value;
    }
    return Hljs.highlight(lang, code).value;
  }
})

// 段落解析
const paragraphParse = text => {
  const textIsImage = text.includes('<img');
  if (textIsImage) return `<div class="image-package">${text}</div>`;
  return `<p>${text}</p>`;
};

renderer.paragraph = paragraphParse

// eslint-disable-next-line no-unused-vars
export default (content, tags, parseHtml = false) => {
  if (typeof content !== 'string') {
    return '';
  }

  // 生成目录树
  var toc = [];

  const headingParse = function(text, level, raw) {
    var anchor = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');
    if (level >= 4 || level === 1) return `<h${level} id="${anchor}">${text}</h${level}>\n`;
    toc.push({
      anchor: `#header-${toc.length}`,
      level,
      text
    });
    return `<h${level} id="header-${toc.length - 1}">${text}</h${level}>\n`;
  };

  // marked.setOptions({ sanitize: !parseHtml });

  renderer.heading = headingParse;

  // if (!parseHtml) renderer.image = commentImageParse;

  let html = marked(content, { renderer });

  // 返回解析内容
  return { html, toc };
};