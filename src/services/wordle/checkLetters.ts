export const checkLetters = (letters:Element[],rightWord:string)=>{
  letters.forEach((element, index) => {
    if (element.textContent === rightWord[index]) {
      element.classList.add("letter-green");
      return;
    }
    if (rightWord.includes(element.textContent)) {
      element.classList.add("letter-yellow");
      return;
    }
    element.classList.add("letter-grey");
  });
}