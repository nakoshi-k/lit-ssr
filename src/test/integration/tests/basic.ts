/**
 * @license
 * Copyright (c) 2020 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import {html} from 'lit-html';
import {repeat} from 'lit-html/directives/repeat.js';

import { SSRTest } from './ssr-test';

export const tests: {[name: string] : SSRTest} = {

  'textExpression': {
    render(x: any) {
      return html`<div>${x}</div>`;
    },
    expectations: [
      {
        args: ['TEST'],
        html: '<div>TEST</div>'
      },
      {
        args: ['TEST2'],
        html: '<div>TEST2</div>'
      }
    ],
    stableSelectors: ['div'],
  },


  'twoTextExpression': {
    render(x: any, y: any) {
      return html`<div>${x}${y}</div>`;
    },
    expectations: [
      {
        args: ['A', 'B'],
        html: '<div>A\n  B</div>'
      },
      {
        args: ['C', 'D'],
        html: '<div>C\n  D</div>'
      }
    ],
    stableSelectors: ['div'],
  },

  'nested templates': {
    render(x: any, y: any) {
      return html`<div>${x}${html`<span>${y}</span>`}</div>`;
    },
    expectations: [
      {
        args: ['A', 'B'],
        html: '<div>A\n  <span>B</span></div>'
      },
      {
        args: ['C', 'D'],
        html: '<div>C\n  <span>D</span></div>'
      }
    ],
    stableSelectors: ['div', 'span'],
  },

  'attributeExpression': {
    render(x: any) {
      return html`<div class=${x}></div>`;
    },
    expectations: [
      {
        args: ['TEST'],
        html: '<div class="TEST"></div>'
      },
      {
        args: ['TEST2'],
        html: '<div class="TEST2"></div>'
      }
    ],
    stableSelectors: ['div'],
  },

  'two attribute expressions': {
    render(x: any, y: any) {
      return html`<div class=${x} foo=${y}></div>`;
    },
    expectations: [
      {
        args: ['A', 'B'],
        html: '<div class="A" foo="B"></div>'
      },
      {
        args: ['C', 'D'],
        html: '<div class="C" foo="D"></div>'
      }
    ],
    stableSelectors: ['div'],
  },

  'two expressions in same attribute': {
    render(x: any, y: any) {
      return html`<div class="${x} ${y}"></div>`;
    },
    expectations: [
      {
        args: ['A', 'B'],
        html: '<div class="A B"></div>'
      },
      {
        args: ['C', 'D'],
        html: '<div class="C D"></div>'
      }
    ],
    stableSelectors: ['div'],
  },

  'mix of expressions across multiple attributes': {
    render(a: any, b: any, c: any, d: any, e: any, f: any) {
      return html`<div ab="${a} ${b}" x c="${c}" y de="${d} ${e}" f="${f}" z></div>`;
    },
    expectations: [
      {
        args: ['a', 'b', 'c', 'd', 'e', 'f'],
        html: '<div ab="a b" x c="c" y de="d e" f="f" z></div>'
      },
      {
        args: ['A', 'B', 'C', 'D', 'E', 'F'],
        html: '<div ab="A B" x c="C" y de="D E" f="F" z></div>'
      }
    ],
    stableSelectors: ['div'],
  },

  'property expression': {
    render(x: any) {
      return html`<div .foo=${x}></div>`;
    },
    expectations: [
      {
        args: [1],
        html: '<div></div>',
        check(assert: Chai.Assert, dom: HTMLElement) {
          assert.strictEqual((dom.querySelector('div') as any).foo, 1);
        }
      },
      {
        args: [2],
        html: '<div></div>',
        check(assert: Chai.Assert, dom: HTMLElement) {
          assert.strictEqual((dom.querySelector('div') as any).foo, 2);
        }
      }
    ],
    stableSelectors: ['div'],
  },

  'two property expression': {
    render(x: any, y: any) {
      return html`<div .foo=${x} .bar=${y}></div>`;
    },
    expectations: [
      {
        args: [1, true],
        html: '<div></div>',
        check(assert: Chai.Assert, dom: HTMLElement) {
          assert.strictEqual((dom.querySelector('div') as any).foo, 1);
          assert.strictEqual((dom.querySelector('div') as any).bar, true);
        }
      },
      {
        args: [2, false],
        html: '<div></div>',
        check(assert: Chai.Assert, dom: HTMLElement) {
          assert.strictEqual((dom.querySelector('div') as any).foo, 2);
          assert.strictEqual((dom.querySelector('div') as any).bar, false);
        }
      }
    ],
    stableSelectors: ['div'],
  },

  'two expressions in one property': {
    render(x: any, y: any) {
      return html`<div .foo="${x},${y}"></div>`;
    },
    expectations: [
      {
        args: [1, true],
        html: '<div></div>',
        check(assert: Chai.Assert, dom: HTMLElement) {
          assert.strictEqual((dom.querySelector('div') as any).foo, '1,true');
        }
      },
      {
        args: [2, false],
        html: '<div></div>',
        check(assert: Chai.Assert, dom: HTMLElement) {
          assert.strictEqual((dom.querySelector('div') as any).foo, '2,false');
        }
      }
    ],
    stableSelectors: ['div'],
  },

  'event binding': {
    render(listener: (e: Event) => void) {
      return html`<button @click=${listener}>X</button>`;
    },
    expectations: [
      {
        args: [(e: Event) => (e.target as any).__wasClicked = true],
        html: '<button>X</button>',
        check(assert: Chai.Assert, dom: HTMLElement) {
          const button = dom.querySelector('button')!;
          button.click();
          assert.strictEqual((button as any).__wasClicked, true);
        }
      },
      {
        args: [(e: Event) => (e.target as any).__wasClicked2 = true],
        html: '<button>X</button>',
        check(assert: Chai.Assert, dom: HTMLElement) {
          const button = dom.querySelector('button')!;
          button.click();
          assert.strictEqual((button as any).__wasClicked2, true);
        }
      }
    ],
    stableSelectors: ['button'],
  },

  'boolean attribute binding, initially true': {
    render(hide: boolean) {
      return html`<div ?hidden=${hide}></div>`;
    },
    expectations: [
      {
        args: [true],
        html: '<div hidden></div>',
      },
      {
        args: [false],
        html: '<div></div>',
      }
    ],
    stableSelectors: ['div'],
  },

  'array with strings': {
    render(words: string[]) {
      return html`<div>${words}</div>`;
    },
    expectations: [
      {
        args: [['A', 'B', 'C']],
        html: '<div>A\n  B\n  C</div>'
      },
      {
        args: [['D', 'E', 'F']],
        html: '<div>D\n  E\n  F</div>'
      }
    ],
    stableSelectors: ['div'],
  },

  'array with strings, updated with fewer items': {
    render(words: string[]) {
     return html`<div>${words}</div>`;
    },
    expectations: [
      {
        args: [['A', 'B', 'C']],
        html: '<div>A\n  B\n  C</div>'
      },
      // Attribute hydration not working yet
      {
        args: [['D', 'E']],
        html: '<div>D\n  E</div>'
      }
    ],
    stableSelectors: ['div'],
  },

  'array with strings, updated with more items': {
    render(words: string[]) {
      return html`<div>${words}</div>`;
    },
    expectations: [
      {
        args: [['A', 'B', 'C']],
        html: '<div>A\n  B\n  C</div>'
      },
      // Attribute hydration not working yet
      {
        args: [['D', 'E', 'F', 'G']],
        html: '<div>D\n  E\n  F\n  G</div>'
      }
    ],
    stableSelectors: ['div'],
  },

  'array with templates': {
    render(words: string[]) {
      return html`<ol>${words.map((w) => html`<li>${w}</li>`)}</ol>`;
    },
    expectations: [
      {
        args: [['A', 'B', 'C']],
        html: '<ol><li>A</li>\n  <li>B</li>\n  <li>C</li></ol>'
      },
      {
        args: [['D', 'E', 'F']],
        html: '<ol><li>D</li>\n  <li>E</li>\n  <li>F</li></ol>'
      }
    ],
    stableSelectors: ['ol', 'li'],
  },

  'repeat with strings': {
    skip: true,
    render(words: string[]) {
      return html`${repeat(words, (word, i) => `(${i} ${word})`)}`;
    },
    expectations: [
      {
        args: [['foo', 'bar', 'qux']],
        html: '(0 foo)\n(1 bar)\n(2 qux)'
      },
      // Attribute hydration not working yet
      {
        args: [['A', 'B', 'C']],
        html: '(0 A)(1 B)(2 C)'
      }
    ],
    stableSelectors: [],
  },

  'repeat with templates': {
    skip: true,
    render(words: string[]) {
      return html`${repeat(words, (word, i) => html`<p>${i}) ${word}</p>`)}`;
    },
    expectations: [
      {
        args: [['foo', 'bar', 'qux']],
        html: '<p>0) foo</p><p>1) bar</p><p>2) qux</p>'
      },
      // Attribute hydration not working yet
      {
        args: [['A', 'B', 'C']],
        html: '<p>0) A</p><p>1) B</p><p>2) C</p>'
      }
    ],
    stableSelectors: ['p'],
  },
};
