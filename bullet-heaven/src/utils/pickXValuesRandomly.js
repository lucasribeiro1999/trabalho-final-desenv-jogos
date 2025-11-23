export function pickXValuesRandomly(array, n) {
    if (!Array.isArray(array) || array.length === 0 || n <= 0) return [];
    const count = Math.min(n, array.length);
    const copy = array.slice();
    const result = [];
    for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}