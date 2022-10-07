export const cleanGrid = (letterRows: HTMLCollectionOf<Element>) => {
  for (let i = 0; i < letterRows.length; i++) {
    const letters = Array.from(letterRows[i].children);
    letters.forEach((letter) => {
      letter.classList.remove(
        "filled-letter",
        "letter-grey",
        "letter-green",
        "letter-yellow"
      );
      letter.textContent = "";
    });
  }
};
