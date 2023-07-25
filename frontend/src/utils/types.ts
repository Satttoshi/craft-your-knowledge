export type Workshop = {
    id: string,
    topic: string,
    subTopic: string,
    buzzWords: string[],
    likes: number,
    estimatedTime: number,
    difficulty: string,
}

export type WorkshopWithoutIdAndLikes = {
    topic: string,
    subTopic: string,
    buzzWords: string[],
    estimatedTime: number,
    difficulty: string,
}