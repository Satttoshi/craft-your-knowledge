import {create} from "zustand";
import axios from "axios";
import {WorkshopWithoutIdAndLikes} from "../utils/types.ts";




type State = {
    createWorkshop: (requestBody: WorkshopWithoutIdAndLikes) => void,
}


export const useStore = create<State>(() => ({
    // STORE START

    createWorkshop: async (requestBody: WorkshopWithoutIdAndLikes) => {
        try {
            await axios.post("/api/workshop", requestBody);
        }
        catch (error) {
            console.error(error);
        }
    }

    // STORE END
}));
