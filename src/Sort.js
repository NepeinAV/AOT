export const descComp = (a, b) => {
    if (a > b) return 1;
    return 0;
}

export const revComp = (a, b) => {
    if (a.split('').reverse() < b.split('').reverse()) return 1;
    return 0;
}

export const revDescComp = (a, b) => {
    if (a.split('').reverse() > b.split('').reverse()) return 1;
    return 0;
}