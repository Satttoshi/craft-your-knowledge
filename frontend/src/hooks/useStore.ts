import {create} from "zustand";
import axios from "axios";
import {Gpt3TurboResponse, PersonalStatus, Workshop, WorkshopFormData, WorkshopUserChallenge} from "../utils/types.ts";


type State = {
    workshops: Workshop[],
    workshop: Workshop | null,
    isCreatingWorkshop: boolean,
    isReadingWorkshops: boolean,
    playAnimation: boolean,
    isValidatingChallenge: boolean,

    createWorkshop: (requestBody: WorkshopFormData) => Promise<Workshop>,
    readWorkshops: () => void,
    readWorkshopById: (id: string) => void,
    getWorkshopById: (id: string) => Workshop,
    updatePersonalStatus: (workshopId: string, personalStatus: PersonalStatus) => void,
    deleteWorkshop: (workshopId: string) => void,
    validateChallenge: (workshopId: string, workshopUserChallenge: WorkshopUserChallenge) => Promise<Gpt3TurboResponse>
}

export const useStore = create<State>((set, get) => ({
    // STORE START

    workshops: [],
    workshop: null,

    isCreatingWorkshop: false,
    isReadingWorkshops: false,

    playAnimation: false,
    isValidatingChallenge: false,

    createWorkshop: async (requestBody) => {
        const readWorkshops = get().readWorkshops;
        try {
            set({isCreatingWorkshop: true});
            const response = await axios.post("/api/workshop", requestBody);
            readWorkshops();
            return response.data;
        } catch (error) {
            console.error(error);
            set({isCreatingWorkshop: false});
            throw error;
        } finally {
            set({playAnimation: true});
            set({isCreatingWorkshop: false});
            setTimeout(() => set({playAnimation: false}), 4000);
        }
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

    getWorkshopById: (id: string): Workshop => {
        if (!id) {
            throw new Error("Workshop ID is invalid")
        }
        const workshops = get().workshops;
        const workshop = workshops.find(workshop => workshop.id === id);
        if (!workshop) {
            throw new Error("Workshop not found")
        }
        return workshop;
    },

    readWorkshopById: (id: string) => {
        const readWorkshops = get().readWorkshops;
        axios.get(`/api/workshop/${id}`)
            .then(response => {
                set({workshop: response.data});
            })
            .catch(console.error)
            .finally(readWorkshops)
    },

    updatePersonalStatus: (workshopId: string, personalStatus: PersonalStatus) => {
        axios.put(`/api/workshop/${workshopId}`, personalStatus)
            .catch(console.error)
    },

    deleteWorkshop: (workshopId: string) => {
        const readWorkshops = get().readWorkshops;
        axios.delete(`/api/workshop/${workshopId}`)
            .catch(console.error)
            .finally(readWorkshops)
    },

    validateChallenge: async (workshopId: string, workshopUserChallenge: WorkshopUserChallenge) => {
        set({isValidatingChallenge: true});
        try {
            const response = await axios.post(`/api/workshop/${workshopId}/validate`, workshopUserChallenge);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            set({isValidatingChallenge: false});
        }
    },

    // STORE END
}));
