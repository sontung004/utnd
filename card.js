// Hàm tạo thẻ
function createCard(selectedText) {
    let card = document.createElement('div');
    card.id = 'search-card';
  
    let question = document.createElement('p');
    question.id = 'search-question';
    question.innerText = selectedText;
  
    let answer = document.createElement('p');
    answer.id = 'search-answer';
    answer.innerText = 'Đang tìm kiếm...';
  
    card.appendChild(question);
    card.appendChild(answer);
  
    return card;
  }
  
  // Hàm hiển thị thẻ
  function displayCard(selectedText) {
    let card = createCard(selectedText);
    let rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
  
    card.style.position = 'absolute';
    card.style.left = rect.left + 'px';
    card.style.top = rect.bottom + 'px';
  
    document.body.appendChild(card);
  }
  function createCard(selectedText) {
    let card = document.createElement('div');
    card.id = 'search-card';
  
    let closeButton = document.createElement('span');
    closeButton.id = 'close-button';
    closeButton.innerText = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '5px';
    closeButton.style.top = '5px';
    closeButton.style.cursor = 'pointer';
  
    closeButton.addEventListener('click', function() {
      removeButtonAndCard();
    });
  
    let question = document.createElement('p');
    question.id = 'search-question';
    question.innerText = selectedText;
  
    let answer = document.createElement('p');
    answer.id = 'search-answer';
    answer.innerText = 'Đang tìm kiếm...';
  
    let progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.height = '5px';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = '#4CAF50';
  
    card.appendChild(closeButton);
    card.appendChild(question);
    card.appendChild(answer);
    card.appendChild(progressBar);
  
    return card;
  }
  
  function searchAnswer(selectedText) {
    let answer = document.getElementById('search-answer');
    let progressBar = document.getElementById('progress-bar');
  
    const jsonFilePath = 'data.json';
    let startTime = Date.now();
    let limitTime = 10000;
  
    fetch(chrome.runtime.getURL(jsonFilePath))
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(data => {
        let result = findAnswer(data, selectedText);
  
        if (result) {
          answer.innerText = result;
          progressBar.style.width = '100%';
        } else {
          answer.innerText = 'Không tìm thấy.';
          progressBar.style.width = '100%';
        }
      })
      .catch(error => {
        answer.innerText = 'Đã xảy ra lỗi.';
        progressBar.style.width = '100%';
        console.error('Error:', error);
      });
  
    let updateProgressBar = setInterval(function() {
      let currentTime = Date.now();
      let elapsedTime = currentTime - startTime;
      let percentage = Math.min((elapsedTime / limitTime) * 100, 100);
      progressBar.style.width = percentage + '%';
  
      if (elapsedTime >= limitTime) {
        clearInterval(updateProgressBar);
      }
    }, 10);
  }
  