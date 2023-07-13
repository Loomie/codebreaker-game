import { wordlist_de } from "./wordlist_de.mjs"
import { wordlist_en } from "./wordlist_en.mjs"

export const wordlist = function () {
    const lang = process.env.LANG
    console.debug(`lang is ${lang}`)
    if (lang?.startsWith('de')) {
        console.debug('using wordlist DE')
        return wordlist_de
    }
    console.debug('using wordlist EN')
    return wordlist_en
}