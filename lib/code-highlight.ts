
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'


export function highlightSyntax(code: string, language: string): string {
  const lang = Prism.languages[language] || Prism.languages.plaintext
  return Prism.highlight(code, lang, language)
}