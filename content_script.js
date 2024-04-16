document.addEventListener('mouseup', function(event) {
  var selectedText = window.getSelection().toString().trim();

  // Gửi thông điệp chứa văn bản đã tô đen tới background script hoặc popup script của extension
  chrome.runtime.sendMessage({ action: "getSelectedText", selectedText: selectedText });

  // Gọi hàm hiển thị nút
  displayButton();

  // Gọi hàm hiển thị thẻ
  displayCard(selectedText);
});
