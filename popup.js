document.addEventListener('DOMContentLoaded', function() {
  let resultDiv = document.getElementById('result');

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code: `window.getSelection().toString().trim().toLowerCase();`
    }, function(selection) {
      let selectedText = selection[0];

      if (selectedText !== '') {
        displayAnswer(selectedText);
      } else {
        resultDiv.innerText = 'Vui lòng bôi đen.';
      }
    });
  });
  function displayAnswer(selectedText) {
    const jsonFilePath = 'data.json';

    fetch(chrome.runtime.getURL(jsonFilePath))
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(data => {
        let answer = findAnswer(data, selectedText);
        if (answer) {
          resultDiv.innerHTML = `<p><strong>Câu trả lời:</strong> ${answer}</p>`;
        } 
        else {
          let sanswer = ffindAnswer(data, selectedText);
          if(sanswer)
          {
            resultDiv.innerHTML = `<p><strong>Câu trả lời:</strong> ${sanswer}</p>`;
          }
          else
          {
            resultDiv.innerText = 'Không tìm thấy.';
          }
        }
      })
      .catch(error => {
        resultDiv.innerText = 'Đã xảy ra lỗi.';
        console.error('Error:', error);
      });
  }

  function findAnswer(data, selectedText) {
    if (data && data.questions) {
      let questions = data.questions.filter(item => item.question.toLowerCase() === selectedText);

      if (questions.length > 0) {
        return questions[0].answer;
      }
    }
    return null;
  }
  function ffindAnswer(data, selectedText) {
    if (data && data.questions) {
      // Sắp xếp các câu hỏi theo thứ tự bảng chữ cái
      let questions = data.questions.sort((a, b) => a.question.localeCompare(b.question));
  
      // Tìm kiếm nhị phân câu hỏi có độ tương đồng cao nhất với văn bản đã tô đen
      let left = 0;
      let right = questions.length - 1;
      let bestMatch = null;
      let bestScore = 0;
  
      while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        let question = questions[mid].question.toLowerCase();
        let score = getSimilarityScore(selectedText, question);
  
        if (score > bestScore) {
          bestScore = score;
          bestMatch = questions[mid].answer;
        }
  
        if (question < selectedText) {
          left = mid + 1;
        } else if (question > selectedText) {
          right = mid - 1;
        } else {
          break;
        }
      }
  
      return bestMatch;
    }
    return null;
  }
  
  // Hàm tính số lượng từ chung giữa hai chuỗi văn bản
  function getSimilarityScore(text1, text2) {
    let words1 = text1.split(/\s+/);
    let words2 = text2.split(/\s+/);
    let commonWords = 0;
  
    for (let word of words1) {
      if (words2.includes(word)) {
        commonWords++;
      }
    }
  
    return commonWords;
  }  
});
