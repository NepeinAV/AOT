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

export const dblDescComp = (a, b) => {
    if (a[1] > b[1]) return 1;
}

export const dblComp = (a, b) => {
    if (a[1] < b[1]) return 1;
}