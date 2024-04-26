// @ts-check

// #region UTILS
/**
 * Checks if slice of text contains vowels.
 * @param {string} x
 * @returns {boolean}
 */
function hasVowels(x) {
	const vowels = [
		'a',
		'á',
		'e',
		'é',
		'i',
		'í',
		'o',
		'ó',
		'u',
		'ú',
		'A',
		'Á',
		'E',
		'É',
		'I',
		'Í',
		'O',
		'Ó',
		'U',
		'Ú',
	]
	let value = false

	x.split('').forEach(letter => {
		if (vowels.includes(letter.toLowerCase())) {
			value = true
		}
	})

	return value
}

/**
 * Checks if slice of text contains consonants.
 * @param {string} x
 * @returns {boolean}
 */
function hasConsonants(x) {
	const consonants = [
		'b',
		'c',
		'd',
		'f',
		'g',
		'h',
		'j',
		'k',
		'l',
		'm',
		'n',
		'ñ',
		'p',
		'q',
		'r',
		's',
		't',
		'v',
		'w',
		'x',
		'y',
		'z',
		'B',
		'C',
		'D',
		'F',
		'G',
		'H',
		'J',
		'K',
		'L',
		'M',
		'N',
		'Ñ',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'V',
		'W',
		'X',
		'Y',
		'Z',
	]
	let value = false

	x.split('').forEach(letter => {
		if (consonants.includes(letter.toLowerCase())) {
			value = true
		}
	})

	return value
}

/**
 * Checks if slice of text matches at spanish consonant group.
 * @param {string} x
 * @returns {boolean}
 */
function isConsonantGroup(x) {
	const consonantGroups = [
		'cl',
		'bl',
		'gl',
		'gr',
		'gn',
		'll',
		'pl',
		'tl',
		'cr',
		'br',
		'dr',
		'fr',
		'pr',
		'tr',
		'ch',
		'ps',
		'rr',
		'fl',
	]

	return consonantGroups.includes(x.toLowerCase())
}

// #region WORD CLASS
/**
 * This class provides core functionality of word grammar.
 */
class Word {
	_vowels = ['a', 'e', 'i', 'o', 'u']
	_accentedVowels = ['á', 'é', 'í', 'ó', 'ú', 'Á', 'É', 'Í', 'Ó', 'Ú']
	_closedVowels = ['i', 'u', 'I', 'U']
	_openVowels = ['a', 'e', 'o', 'A', 'E', 'O']
	_closedVowelsAccented = ['i', 'u', 'I', 'U', 'í', 'ú', 'Í', 'Ú']
	_openVowelsAccented = [
		'a',
		'e',
		'o',
		'A',
		'E',
		'O',
		'á',
		'é',
		'ó',
		'Á',
		'É',
		'Ó',
	]

	_umlauts = ['ü', 'Ü']
	_caseConsonants = ['n', 's', 'N', 'S']

	/**
	 * @param {string} x
	 */
	constructor(x) {
		if (x === '') throw new Error('x should not be an empty string.')
		/**
		 * @type {string}
		 */
		this._word = x
		/**
		 * Word split into syllables.
		 * @type {string[]}
		 */
		this.syllables = this._getSyllables()
		/**
		 * Tonic syllable obtained based on Spanish accentuation rules.
		 * @type {string}
		 */
		this.tonicSyllable = this._getTonicSyllable()
		/**
		 * Index of tonic syllable.
		 * @type {number}
		 */
		this.tonicSyllableIndex = this._getTonicSyllableByIndex()
		/**
		 * List of the all vowels.
		 * @type {string[]}
		 */
		this.vowels = this._getVowels()
		/**
		 * List of the all consonants.
		 * @type {string[]}
		 */
		this.consonants = this._getConsonants()
		/**
		 * Grammatical classification based on Spanish accentuation rules.
		 * @type {string | null}
		 */
		this.type = this._getType()
		/**
		 * Contains public access word attribute of the class.
		 * @type {string}
		 */
		this.value = this._word
	}

	/**
	 * Split word by syllables, using spanish grammar rules.
	 * @returns {Array}
	 */
	_getSyllables() {
		const wordLen = this._word.length
		const mergedVowels = []
		let i = 0

		while (i < wordLen) {
			const letter = this._word[i]
			const nextLetter = i + 1 < wordLen ? this._word[i + 1] : ''
			const nextTwoLetter = i + 2 < wordLen ? this._word[i + 2] : ''

			if (
				(this._closedVowelsAccented.includes(letter) &&
					this._openVowelsAccented.includes(nextLetter) &&
					this._closedVowelsAccented.includes(nextTwoLetter)) ||
				(this._openVowelsAccented.includes(letter) &&
					this._closedVowelsAccented.includes(nextLetter) &&
					this._openVowelsAccented.includes(nextTwoLetter))
			) {
				mergedVowels.push(letter + nextLetter + nextTwoLetter)
				i += 2
			} else if (
				(this._openVowelsAccented.includes(letter) &&
					this._closedVowels.includes(nextLetter)) ||
				(this._closedVowels.includes(letter) &&
					this._openVowelsAccented.includes(nextLetter)) ||
				(this._umlauts.includes(letter) && this._vowels.includes(nextLetter)) ||
				(['u', 'U'].includes(letter) &&
					['i', 'I', 'í', 'Í'].includes(nextLetter))
			) {
				mergedVowels.push(letter + nextLetter)
				i++
			} else {
				mergedVowels.push(letter)
			}

			i++
		}

		const mergedVowelsLen = mergedVowels.length
		const syllables = []
		let consonantsCount = 0
		let j = 0

		while (j < mergedVowelsLen) {
			let tmpSlice = mergedVowels[j]
			const nextSlice = j + 1 < mergedVowelsLen ? mergedVowels[j + 1] : ''
			const prevSlice = j - 1 >= 0 ? mergedVowels[j - 1] : ''

			if (hasConsonants(tmpSlice)) {
				consonantsCount++
			}

			if (consonantsCount === 1 && hasVowels(nextSlice)) {
				tmpSlice += nextSlice
				j++
				consonantsCount = 0
			} else if (
				consonantsCount === 1 &&
				!isConsonantGroup(tmpSlice + nextSlice) &&
				(hasConsonants(nextSlice) || nextSlice === '')
			) {
				const syllablesLen = syllables.length

				if (syllablesLen > 0) {
					syllables[syllablesLen - 1] += tmpSlice
					if (['y', 'Y'].includes(tmpSlice)) tmpSlice = ''
				}

				consonantsCount = 0
			} else if (
				consonantsCount === 2 &&
				isConsonantGroup(prevSlice + tmpSlice) &&
				hasVowels(nextSlice)
			) {
				tmpSlice = prevSlice + tmpSlice + nextSlice
				j++
				consonantsCount = 0
			}

			const syllable = tmpSlice

			if (
				(syllable !== '' &&
					!(syllable.length === 1 && hasConsonants(syllable))) ||
				['y', 'Y'].includes(syllable)
			) {
				syllables.push(syllable)
			}

			j++
		}

		return syllables
	}

	/**
	 * Returns tonic syllable.
	 * @returns {string}
	 */
	_getTonicSyllable() {
		return this.syllables[this._getTonicSyllableByIndex()]
	}

	/**
	 * Determine the index of the tonic syllable in the syllable list.
	 * @returns {number}
	 */
	_getTonicSyllableByIndex() {
		const syllablesLen = this.syllables.length
		const wordLen = this._word.length
		const lastLetter = wordLen - 1 >= 0 ? this._word[wordLen - 1] : ''
		let tonicIndex = 0

		if (
			this._caseConsonants.includes(lastLetter) ||
			this._vowels.includes(lastLetter)
		) {
			tonicIndex = syllablesLen - 2 >= 0 ? syllablesLen - 2 : 0
		} else tonicIndex = syllablesLen - 1 >= 0 ? syllablesLen - 1 : 0

		this.syllables.forEach((syllable, index) => {
			syllable.split('').forEach(letter => {
				if (this._accentedVowels.includes(letter)) tonicIndex = index
			})
		})

		return tonicIndex
	}

	/**
	 * @returns {string[]} List with all vowels of the word.
	 */
	_getVowels() {
		return Array.from(this._word).filter(letter => hasVowels(letter))
	}

	/**
	 * @returns {string[]} List with all consonants of the word.
	 */
	_getConsonants() {
		return Array.from(this._word).filter(letter => hasConsonants(letter))
	}

	/**
	 * Returns the grammatical classification of the given word.
	 * @returns {string | null}
	 */
	_getType() {
		const typeByNumber =
			(this._getTonicSyllableByIndex() - this.syllables.length) * -1
		let wordType = null

		if (this.syllables.length === 1) wordType = 'monosilaba'
		else if (typeByNumber === 1) wordType = 'oxitona'
		else if (typeByNumber === 2) wordType = 'paroxitona'
		else if (typeByNumber === 3) wordType = 'proparoxitona'
		else if (typeByNumber > 3) wordType = 'superproparoxitona'

		return wordType
	}
}

// #region LIBRARY FUNCTIONS
/**
 * @typedef {Object} word
 * @property {string} word
 * @property {string[]} syllables
 * @property {string} tonicSyllable
 * @property {string[]} vowels
 * @property {string[]} consonants
 * @property {string | null} type
 */

/**
 * This function takes a list of words as input and returns their corresponding grammatical information.
 * @param {string[]} wordList
 * @returns {Promise<word[]>}
 */
async function analyseWordList(wordList) {
	const wordsAnalysed = []

	for (let i = 0; i < wordList.length; i++) {
		const wordItem = wordList[i].trim()
		const wd = new Word(wordItem)

		wordsAnalysed.push({
			word: wd.value,
			syllables: wd.syllables,
			tonicSyllable: wd.tonicSyllable,
			tonicSyllableIndex: wd.tonicSyllable,
			vowels: wd.vowels,
			consonants: wd.consonants,
			type: wd.type,
		})
	}

	return wordsAnalysed
}

/**
 * @param {string} text
 * @returns {Promise<word[]>}
 */
async function analyseText(text) {
	const pattern = /[\p{Punctuation}\p{Symbol}]|\n|\./gu
	const wordList = text.trim().replace(pattern, '').split(/\s+/)

	return await analyseWordList(wordList)
}

export {
	hasVowels,
	hasConsonants,
	isConsonantGroup,
	Word,
	analyseWordList,
	analyseText,
}
