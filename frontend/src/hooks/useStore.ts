import {create} from "zustand";
import axios from "axios";
import {WorkshopWithoutIdAndLikes} from "../utils/types.ts";




type State = {
    isCreatingWorkshop: boolean,
    createWorkshop: (requestBody: WorkshopWithoutIdAndLikes) => void,
}


export const useStore = create<State>((set) => ({
    // STORE START

    isCreatingWorkshop: false,

    createWorkshop: async (requestBody: WorkshopWithoutIdAndLikes) => {
        try {
            set({isCreatingWorkshop: true})
            await axios.post("/api/workshop", requestBody);
        }
        catch (error) {
            console.error(error);
        } finally {
            set({isCreatingWorkshop: false})
        }
    }

    // STORE END
}));
