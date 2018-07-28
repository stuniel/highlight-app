'use strict';

(function () {
  'use strict';

  var elements = {
    content: document.querySelector('.content'),
    editor: document.querySelector('.editor'),
    pagination: document.querySelector('.pagination-input'),
    wrapper: document.querySelector('.wrapper')
  };

  var state = {
    page: 1,
    highlighted: false,
    text: ''
  };

  function handlePaginationChange(e) {
    var page = e.target.value;
    fetchDocument(page);
  }

  function handleSelection(e) {
    var content = elements.content;

    if (!window.getSelection) return;

    var selection = window.getSelection();
    var selectedContent = selection.anchorNode.parentNode === content;
    var selectedText = selection.toString().trim();
    var selectedWords = selectedText.split(' ').length;

    if (!selection || !selectedContent || selectedWords > 1) return;

    var text = content.innerText;
    var re = new RegExp(selectedText, "g");
    var highlight = '<span class="highlight">' + selectedText + '</span>';
    var highlightedText = text.replace(re, highlight);
    content.innerHTML = highlightedText;

    state.text = text;
    state.highlighted = true;
  }

  function handleOuterClick(e) {
    if (!state.highlighted) return;
    var text = state.text;
    var content = elements.content;


    content.innerHTML = text;
    state.highlighted = false;
  }

  function fetchDocument(page) {
    var url = 'http://localhost:9000/documents/' + page;
    elements.wrapper.classList.remove('error');

    fetch(url).then(function (res) {
      if (res.status === 404) {
        elements.wrapper.classList.add('error');
      }
      return res.text();
    }).then(function (text) {
      elements.content.innerText = text;
      state.text = text;
    }).catch(function (err) {
      return console.error(err);
    });

    elements.pagination.value = page;
  }

  elements.pagination.addEventListener('change', handlePaginationChange);
  document.addEventListener('mouseup', handleSelection);
  document.addEventListener('mousedown', handleOuterClick);

  fetchDocument(state.page);
})();