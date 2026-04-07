import { questions } from "@/data/questions";

let usedIndexes: number[] = [];

export const getRandomQuestion = () => {
    if (usedIndexes.length === questions.length) {
        usedIndexes = []; // reset kalau sudah habis
    }

    let index;
    do {
        index = Math.floor(Math.random() * questions.length);
    } while (usedIndexes.includes(index));

    usedIndexes.push(index);

    return questions[index];
};