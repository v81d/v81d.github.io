document.getElementById('sendButton').addEventListener('click', function() {
  const webhookURL = 'YOUR_DISCORD_WEBHOOK_URL';
  const messageContent = document.getElementById('messageInput').value;
  const message = {
    content: messageContent
  };

  fetch(webhookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
  .then(response => {
    if (response.ok) {
      alert('Message sent successfully!');
    } else {
      alert('Failed to send message.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
