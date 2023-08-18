import CreateForm from "../components/CreateForm.tsx";
import WorkshopPrompter from "../utils/WorkshopPrompter.ts";

export default function Create() {
    const prompter = new WorkshopPrompter();
    const randomText = prompter.getRandomText();

    return (
        <CreateForm randomText={randomText}/>
    );
}
