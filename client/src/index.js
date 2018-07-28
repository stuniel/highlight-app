(function() {
  'use strict'

  const elements = {
    content: document.querySelector('.content'),
    editor: document.querySelector('.editor'),
    pagination: document.querySelector('.pagination-input'),
    wrapper: document.querySelector('.wrapper')
  }

  const state = {
    page: 1,
    highlighted: false,
    text: ''
  }

  function handlePaginationChange (e) {
    const page = e.target.value
    fetchDocument(page)
  }

  function handleSelection (e) {
    const { content } = elements
    if (!window.getSelection) return

    const selection = window.getSelection()
    const selectedContent = selection.anchorNode.parentNode === content
    const selectedText = selection.toString().trim()
    const selectedWords = selectedText.split(' ').length

    if (!selection || !selectedContent || selectedWords > 1) return

    const text = content.innerText
    const re = new RegExp(selectedText, "g")
    const highlight = `<span class="highlight">${selectedText}</span>`
    const highlightedText = text.replace(re, highlight)
    content.innerHTML = highlightedText

    state.text = text
    state.highlighted = true
  }

  function handleOuterClick (e) {
    if (!state.highlighted) return
    const { text } = state
    const { content } = elements

    content.innerHTML = text
    state.highlighted = false
  }

  function fetchDocument (page) {
    const url = `http://localhost:9000/documents/${page}`
    elements.wrapper.classList.remove('error')

    fetch(url)
    .then(res => {
      if (res.status === 404) {
        elements.wrapper.classList.add('error')
      }
      return res.text()
    })
    .then(text => {
      elements.content.innerText = text
      state.text = text
    })
    .catch(err => console.error(err))

    elements.pagination.value = page
  }

  elements.pagination.addEventListener('change', handlePaginationChange)
  document.addEventListener('mouseup', handleSelection)
  document.addEventListener('mousedown', handleOuterClick)

  fetchDocument(state.page)
})()
