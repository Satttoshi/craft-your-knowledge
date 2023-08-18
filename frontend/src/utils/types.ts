export type Workshop = {
    id: string,
    language: string,
    topic: string,
    buzzWords: string[],
    likes: number,
    personalStatuses: PersonalStatus[],
    article: Gpt3TurboResponse,
    challenge: Gpt3TurboResponse
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
    content: string
}

export type PersonalStatus = {
    user: {
        id: string,
        username: string,
    },
    progressStatus: string,
    isLiked: boolean
}

export type WorkshopFormData = {
    language: string,
    topic: string,
    buzzWords: string[]
}

export type WorkshopUserChallenge = {
    user: {
        id: string,
        username: string,
    },
    language: string,
    topic: string,
    challenge: string,
    answer: string | undefined

}
