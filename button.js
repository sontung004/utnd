// Hàm tạo nút
function createButton() {
    let button = document.createElement('button');
    button.id = 'search-button';
    button.innerText = 'Tìm kiếm';
  
    button.addEventListener('click', function() {
      let selectedText = window.getSelection().toString().trim();
      createCard(selectedText);
    });
  
    return button;
  }
  
  // Hàm hiển thị nút
  function displayButton() {
    let selectedText = window.getSelection().toString().trim();
  
    if (selectedText !== '') {
      let button = createButton();
      let rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
  
      button.style.position = 'absolute';
      button.style.left = rect.right + 'px';
      button.style.top = rect.top + 'px';
  
      document.body.appendChild(button);
    }
  }
  // Hàm xóa nút và thẻ
function removeButtonAndCard() {
  let button = document.getElementById('search-button');
  let card = document.getElementById('search-card');

  if (button && card) {
    document.body.removeChild(button);
    document.body.removeChild(card);
  }
}

document.addEventListener('mousedown', function(event) {
  let target = event.target;

  if (target.id !== 'search-button' && target.id !== 'search-card' && target.id !== 'close-button') {
    removeButtonAndCard();
  }
});
