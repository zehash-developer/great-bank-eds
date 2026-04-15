export function extractData(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  return rows.map((row) => {
    const cells = [...row.children];
    return {
      title: cells[0]?.textContent?.trim() || '',
      body: cells[1]?.textContent?.trim() || '',
    };
  });
}

export function renderHTML(items) {
  return items
    .map(
      (item) => `
        <article class="sample-block__item">
          <h3 class="sample-block__title">${item.title}</h3>
          <p class="sample-block__body">${item.body}</p>
        </article>
      `,
    )
    .join('');
}

export default function decorate(block) {
  const items = extractData(block);
  block.innerHTML = `<div class="sample-block">${renderHTML(items)}</div>`;
}
