// Lắng nghe sự kiện khi click chuột phải để hiển thị context menu
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "showAnswer",
    title: "Hiển thị Đáp Án",
    contexts: ["selection"]
  });
});

// Xử lý khi người dùng click vào mục trong context menu
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "showAnswer") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: displayResult,
      args: [info.selectionText]
    });
  }
});

// Hàm để hiển thị kết quả
function displayResult(selectedText) {
  chrome.runtime.getPackageDirectoryEntry(function(root) {
    root.getFile('data.json', {}, function(fileEntry) {
      fileEntry.file(function(file) {
        var reader = new FileReader();

        reader.onloadend = function() {
          var data = JSON.parse(this.result);
          var answer = findAnswer(data, selectedText);

          // Hiển thị kết quả trong thanh công cụ
          alert(answer ? `Câu hỏi: ${selectedText}\nCâu trả lời: ${answer}` : 'Không tìm thấy câu trả lời.');
        };

        reader.readAsText(file);
      });
    });
  });
}

// Hàm tìm câu trả lời trong dữ liệu JSON
function findAnswer(data, selectedText) {
  if (data && data.questions) {
    var foundQuestion = data.questions.find(item => item.question.toLowerCase() === selectedText.toLowerCase());
    return foundQuestion ? foundQuestion.answer : null;
  }
  return null;
}
