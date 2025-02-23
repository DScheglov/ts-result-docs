class Unsafe {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }

  valueOf() {
    return this.value;
  }

  toJSON() {
    return this.value;
  }
}

function unsafe(template) {
  const s = String.raw(template, ...substitutions);
  return new Unsafe(s);
}

const isUnsafe = (value) => value instanceof Unsafe;

function cut(str, length) {
  if (str.length <= length) return str;
  return str.slice(0, length - 3) + '...';
}

const CircularRef = { toJSON: () => '[Circular]' };

const isPrimitive = (value) => {
  return value === null || (typeof value !== 'object');
}

function removeCircularRefs(value, seen = new Set()) {
  if (isPrimitive(value)) return value;
  if (Array.isArray(value)) return value.map((v) => removeCircularRefs(v, seen));
  if (seen.has(value)) return CircularRef;
  seen.add(value);

  const keys = [
    ...Object.getOwnPropertyNames(value),
    ...Object.getOwnPropertySymbols(value)
  ];

  return keys.reduce((acc, key) => {
    acc[key] = removeCircularRefs(value[key], seen);
    return acc;
  }, {});
}

function format(input, name, constr) {
  const prefix = name != null ? `<span class="key">${name.toString()}: </span>` : ''
  if (input === CircularRef) return `${prefix}<span class="circular">[Circular]</span>`;

  if (input === undefined) return `${prefix}<span class="undefined">undefined<span>`;
  if (input === null) return `${prefix}<span class="null">null</span>`;
  if (typeof input === 'string' || isUnsafe(input)) {
    const str = isUnsafe(input) ? input.toString() : input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return prefix
      ? `${prefix}<span class="string">${JSON.stringify(str)}</span>`
      : `${str}`;
  }
  if (typeof input === 'number') return `${prefix}<span class="number">${input}</span>`;
  if (typeof input === 'boolean') return `${prefix}<span class="boolean">${input}</span>`;
  if (typeof input === 'function') return `${prefix}<span class="function">${input}</span>`;
  if (input instanceof Error) return `<div class="collapsible">
    ${prefix}
    <span class="collapsible-arrow">+</span>
    <span class="error"><strong>${input.name || input.constructor.name}</strong>: ${input.message}</span>
    <div class="collapsible-content">
      ${input.cause ? `<div class="collapsible-item">${format(input.cause, "cause")}</div>` : ''}
      <div class="collapsible-item"><pre>${input.stack}</pre></div>
    </div>
  </div>`;

  if (input instanceof Date) return format({
    "iso": input.toISOString(),
    "stamp": input.getTime(),
  }, name, `Date<span class="number">${input.toLocaleString()}</span>`);
  
  const obj = removeCircularRefs(input);

  if (Array.isArray(obj)) {
    return `
      <div class="collapsible">
        ${prefix}
        <span class="collapsible-arrow">+</span>
        [<span class="collapsible-length">${obj.length} items</span>
        <div class="collapsible-content">
          ${obj.map((item, index) => 
            `<div class='collapsible-item'>${format(item, index)}</div>`
          ).join('')}
        </div>]
      </div>`
  }

  const constructor = constr || (input.constructor !== Object ? input.constructor?.name || '' : '');
  const names = Object.getOwnPropertyNames(obj);
  const symbols = Object.getOwnPropertySymbols(obj);
  const keys = [...names, ...symbols];
  const preview = cut(JSON.stringify(obj, null, 2).replace(/\\n/g, ' ').slice(1, -1), 75);

  return `<div class="collapsible">
    ${prefix}
    <span class="collapsible-arrow">+</span>
    ${constructor}
    {&nbsp;<span class="collapsible-preview">${preview}</span>
    <div class="collapsible-content">
      <div class="collapsible-item">${
        keys.map(key => `<div class="collapsible-item">${format(obj[key], key)}</div>`).join('')}
      </div>
    </div>}
    <span class="collapsible-length">${keys.length} keys</span>
  </div>`
  
}

const debounce = (fn, delay) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  }
}

const ensureArrowOnClick = debounce(() => {
  const collapsibleArrows = document.querySelectorAll('.collapsible-arrow');
  collapsibleArrows.forEach((arrow) => {
      arrow.addEventListener('click', function () {
        this.parentElement.classList.toggle('open');
        this.textContent = this.textContent === '+' ? '-' : '+';
      });
  });
}, 100);

const consoleMethod =
  (output, method) =>
  (...args) => {
    output.innerHTML += `<div class="console-${method}">${
      args.map(arg => format(arg)).join('\t')
    }</div>`;
    ensureArrowOnClick();
  }

function fakeConsole(output) {
  return {
    log: consoleMethod(output, 'log'),
    error: consoleMethod(output, 'error'),
    warn: consoleMethod(output, 'warn'),
  }
}

