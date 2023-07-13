import { wordlist_de } from "./wordlist_de.mjs"
import { wordlist_en } from "./wordlist_en.mjs"

export const wordlist = function () {
    const lang = language()
    console.debug(`lang is ${lang}`)
    if (lang?.startsWith('de')) {
        console.debug('using wordlist DE')
        return wordlist_de
    }
    console.debug('using wordlist EN')
    return wordlist_en
}

function language() {
    if (typeof process === 'undefined') {
        // if called on client side in the browser
        return navigator.language
    }
    return process.env.LANG
}
