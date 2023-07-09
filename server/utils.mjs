/**
 * Compares the contents of two arrays. Works with primitives and same object references.
 * @returns true if both arrays have the same elements
 * @see https://flexiple.com/javascript/javascript-array-equality/
 * @see https://stackoverflow.com/questions/3115982/ */
export function sameArrayContents(first, second) {
    return Array.isArray(first) && Array.isArray(second) &&
        (first === second ||
            (first.length === second.length && first.every((item, index) => { return item === second[index] }))
        )
}