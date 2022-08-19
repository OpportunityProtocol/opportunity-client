export const getRandomColor = () => {
    const num = Math.random()

    if (Math.random() < 0.2) {
        return '#E3F2FD'
    } else if (Math.random() > 0.2 && Math.random() > 0.4) {
        return '#FFEBEE'
    } else if (Math.random() > 0.4 && Math.random() > 0.6) {
        return '#FFFDE7'
    } else if (Math.random() > 0.8 && Math.random() > 1) {
        return '#E8F5E9'
    } else {
        return '#FFF3E0'
    }
}

export const shuffle = (array) => {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

export const hexToDecimal = (num: number) => parseInt(num, 16);