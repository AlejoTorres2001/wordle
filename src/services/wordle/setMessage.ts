export const setMessage = (isCorrect:string, message:string)=>{
  const messageBox = document.getElementById("message-text");
  messageBox.textContent = message;
  if (isCorrect == 'success') {
    messageBox.classList.add("message-text-success");
    return;
  }
  if(isCorrect == 'error'){
  messageBox.classList.add("message-text-error");
  return;
}
  messageBox.classList.remove("message-text-success","message-text-error");
}