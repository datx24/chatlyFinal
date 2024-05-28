import './notification.css'

// Function to show notifications
export const showNotification = (message) => {
  const notificationElement = document.createElement('div');
  notificationElement.classList.add('notification');

  const messageElement = document.createElement('p');
  messageElement.textContent = message;

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Đóng';
  closeButton.addEventListener('click', () => {
      notificationElement.remove(); // Hide the notification when "Đóng" button is clicked
  });

  notificationElement.appendChild(messageElement);
  notificationElement.appendChild(closeButton);

  document.body.appendChild(notificationElement);
};
