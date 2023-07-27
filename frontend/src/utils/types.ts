export type Workshop = {
    id: string,
    topic: string,
    subTopic: string,
    buzzWords: string[],
    likes: number,
    estimatedTimeToMaster: number,
    difficulty: string,
    personalStatuses: PersonalStatus[],
}

export type PersonalStatus = {
    user: {
        id: string,
        name: string,
    },
    progressStatus: string,
    isLiked: boolean,
}

export type WorkshopWithoutIdAndLikes = {
    topic: string,
    subTopic: string,
    buzzWords: string[],
    estimatedTimeToMaster: number,
    difficulty: string,
}
