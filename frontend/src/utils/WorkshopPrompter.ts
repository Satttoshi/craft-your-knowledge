class WorkshopPrompter {
    private prompts: string[] = [
        "Hey there! Imagine you've got this superpower to craft a programming workshop on anything your heart desires. So, what's it gonna be? What's that one thing you're itching to learn or share?",
        "Picture a world where you have the canvas to paint your very own programming workshop. What passions would you bring to life? What knowledge would you share like a beacon of light?",
        "Consider the possibility of orchestrating a programming workshop tailored to your exact learning objectives. Which subject matter would you prioritize? What insights would you bestow upon your attendees?",
        "Dream a little dream... of your perfect programming playground! What magical lessons would you conjure up? And oh! What spells of knowledge would you share?",
        "You've got the reins! Design a programming workshop focused on what YOU want. What are you diving into? And what will you be passing on?",
        "Seize the moment! You have the unique chance to mold a programming workshop that resonates with your inner fire. What fuels your curiosity? What flames of wisdom would you ignite in others?",
        "In the grand tapestry of knowledge, you stand at a crossroad where you can carve out a programming workshop of your choosing. What profound inquiries guide your quest? What truths would you impart?",
        "So, let's say you've got this cool chance to whip up your own programming gig. What's buzzing in your mind? Got any neat tricks or tidbits to share?",
        "Presented with the opportunity to design a programming workshop: What topic would be your focal point? Do you possess any particular insights you'd like to disseminate?",
        "Once upon a digital age, there was a visionary granted the power to weave a programming workshop of their" +
        " dreams. What tales of code would they unravel? What stories of wisdom would they narrate?",
        "Envision a realm where you hold the power to design a programming workshop tailored to your deepest" +
        " curiosities. What knowledge beckons your soul? What wisdom would you wish to share with fellow seekers?"
    ];

    getRandomText(): string {
        const currentTimestamp = new Date().getTime();
        const seed = currentTimestamp % this.prompts.length;
        const randomIndex = Math.floor(seed);
        return this.prompts[randomIndex];
    }
}

export default WorkshopPrompter;
