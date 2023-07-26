import {create} from "zustand";
import axios from "axios";
import {Workshop, WorkshopWithoutIdAndLikes} from "../utils/types.ts";


type State = {
    workshops: Workshop[],
    isCreatingWorkshop: boolean,
    isReadingWorkshops: boolean,
    createWorkshop: (requestBody: WorkshopWithoutIdAndLikes) => void,
    readWorkshops: () => void,
}


export const useStore = create<State>((set, get) => ({
    // STORE START

    workshops: [],
    isCreatingWorkshop: false,
    isReadingWorkshops: false,


    createWorkshop: (requestBody: WorkshopWithoutIdAndLikes) => {
        const readWorkshops = get().readWorkshops;
        set({isCreatingWorkshop: true});
        axios.post("/api/workshop", requestBody)
            .catch(console.error)
            .finally(() => {
                set({isCreatingWorkshop: false});
                readWorkshops();
            })
    },

    readWorkshops: () => {
        set({isReadingWorkshops: true});
        axios.get("/api/workshop")
            .then(response => {
                set({isReadingWorkshops: true});
                set({workshops: response.data});
            })
            .catch(console.error)
            .finally(() => {
                set({isReadingWorkshops: false});
            })
    },

    // STORE END
}));
