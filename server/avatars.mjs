function range(from, to) {
    const chars = []
    let current = from
    const count = to - from
    // console.debug("count " + count + " for 0x" + from.toString(16) + " to 0x" + to.toString(16))
    let i = 0
    for (let current = from; current <= to; current++) {
        chars.push(String.fromCodePoint(current))
    }
    // console.debug("result: " + chars)
    return chars
}

export const avatars = {
    // see https://www.unicode.org/emoji/charts/emoji-list.html and https://unicode.org/Public/emoji/15.0/emoji-sequences.txt
    emojiList: [].concat(
        range(0x1F3F8, 0x1F440), // badminton..eyes
        range(0x1F49F, 0x1F4AB), // heart decoration..dizzy
        range(0x1F4AE, 0x1F4B0), // white flower..money bag
        range(0x1F4F8, 0x1F4FF), // camera with flash..prayer beads
        range(0x1F525, 0x1F531), // fire..trident emblem
        range(0x1F980, 0x1F9C0), // crab..cheese wedge
        range(0x1F9D9, 0x1F9E6))
    ,

    forName(playerName) {
        const hashValue = this.hashCode(playerName)
        // console.debug("count of emojis: " + this.emojiList.length + ", player hash: " + hashValue)
        return this.emojiList[Math.abs(hashValue) % this.emojiList.length]
    },

    // from https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0?permalink_comment_id=2775538#gistcomment-2775538
    hashCode(text) {
        let hash = 0
        for (let i = 0; i < text.length; i++) {
            // "If you're wondering about the | 0 part, it forces h to be a 32-bit number, optimizing for speed in JS engines."
            hash = Math.imul(31, hash) + text.charCodeAt(i) | 0
        }
        return hash
    },

}