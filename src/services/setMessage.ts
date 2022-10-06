export const setMessage = (isCorrect:string, message:string)=>{
  const messageBox = document.getElementById("message-text");
  messageBox.textContent = message;
  if (isCorrect == 'success') {
    messageBox.classList.add("message-text-success");
    return;
  }
  messageBox.classList.add("message-text-error");
}