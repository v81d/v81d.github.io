document.getElementById('sendButton').addEventListener('click', function() {
  const webhookURL = 'https://discord.com/api/webhooks/1282421914769293454/sRONqkteWdt4EUyEow2WTjjaHdc4qpbnf5ln7_aTpKxhgLUeuy4A1A1B--brwQbf1KaH';
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
