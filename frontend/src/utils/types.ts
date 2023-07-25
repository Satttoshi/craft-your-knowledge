export type Workshop = {
    id: string,
    topic: string,
    subTopic: string,
    buzzWords: string[],
    likes: number,
    estimatedTimeToMaster: number,
    difficulty: string,
}

export type WorkshopWithoutIdAndLikes = {
    topic: string,
    subTopic: string,
    buzzWords: string[],
    estimatedTimeToMaster: number,
    difficulty: string,
}