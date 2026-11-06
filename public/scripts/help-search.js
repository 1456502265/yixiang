// 仅在当前页面过滤文档目录，不发送搜索内容，不访问外部服务。
const input = document.querySelector('#help-query');
const items = [...document.querySelectorAll('[data-help-item]')];
input?.addEventListener('input', () => {
  const query = input.value.trim().toLocaleLowerCase();
  let visible = 0;
  for (const item of items) {
    item.hidden = !(item.dataset.search || '').toLocaleLowerCase().includes(query);
    if (!item.hidden) visible++;
  }
  for (const group of document.querySelectorAll('[data-help-group]')) {
    group.hidden = ![...group.querySelectorAll('[data-help-item]')].some(item => !item.hidden);
  }
  const status = document.querySelector('#result-count');
  if (status) status.textContent = query ? `找到 ${visible} 篇相关指南` : `共 ${items.length} 篇使用指南`;
  const empty = document.querySelector('#help-empty');
  if (empty) empty.hidden = visible > 0;
});
