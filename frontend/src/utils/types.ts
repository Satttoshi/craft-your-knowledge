export type Workshop = {
    id: string,
    topic: string,
    subTopic: string,
    buzzWords: string[],
    likes: number,
    estimatedTimeToMaster: number,
    difficulty: string,
    personalStatuses: PersonalStatus[],
    content: string
}

export type Gpt3TurboResponse = {
    id: string,
    object: string,
    created: number,
    choices: Choice[]
    usage: {
        prompt_tokens: number,
        completion_tokens: number,
        total_tokens: number,
    }
}

export type Choice = {
    index: number,
    message: GptMessage,
    finish_reason: string
}

export type GptMessage = {
    role: string,
    text: string
}


export type PersonalStatus = {
    user: {
        id: string,
        name: string,
    },
    progressStatus: string,
    isLiked: boolean
}

export type WorkshopFormData = {
    topic: string,
    subTopic: string,
    buzzWords: string[],
    estimatedTimeToMaster: number,
    difficulty: string
}
