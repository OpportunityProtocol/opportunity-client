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