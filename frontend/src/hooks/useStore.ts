import {create} from "zustand";
import axios from "axios";
import {Gpt3TurboResponse, PersonalStatus, Workshop, WorkshopFormData, WorkshopUserChallenge} from "../utils/types.ts";
import {NavigateFunction} from "react-router-dom";

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

    username: string,
    jwt: string,
    me: () => void,
    login: (userName: string, password: string, navigate: NavigateFunction) => Promise<void>,
    logout: () => void,
    register: (userName: string, password: string, repeatedPassword: string, navigate: NavigateFunction) => Promise<void>,
    isLoggedIn: () => boolean,
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
            const response = await axios.post(
                "/api/workshop",
                requestBody,
                authorisationHeader(get().jwt)
            );
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
        axios.put(`/api/workshop/${workshopId}`, personalStatus, authorisationHeader(get().jwt))
            .catch(console.error)
    },

    deleteWorkshop: (workshopId: string) => {
        const readWorkshops = get().readWorkshops;
        axios.delete(`/api/workshop/${workshopId}`, authorisationHeader(get().jwt))
            .catch(console.error)
            .finally(readWorkshops)
    },

    validateChallenge: async (workshopId: string, workshopUserChallenge: WorkshopUserChallenge) => {
        set({isValidatingChallenge: true});
        try {
            const response = await axios.post(
                `/api/workshop/${workshopId}/validate`,
                workshopUserChallenge,
                authorisationHeader(get().jwt)
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            set({isValidatingChallenge: false});
        }
    },

    username: "anonymousUser",
    jwt: "",

    me: () => {
        const storedJwt = localStorage.getItem("jwt");
        const jwt = storedJwt ?? get().jwt;
        axios.get("/api/user/me", authorisationHeader(jwt))
            .then(response => {
                set({username: response.data});
                localStorage.setItem("jwt", jwt);
            })
            .catch(error => {
                if (error.response && error.response.status === 403) {
                    if (storedJwt) {
                        set({username: "anonymousUser"});
                        set({jwt: ""});
                        localStorage.removeItem("jwt");
                    } else {
                        set({username: "anonymousUser"});
                    }

                } else {
                    console.error(error);
                }
            });
    },

    login: async (username: string, password: string, navigate: NavigateFunction) => {
        try {
            const response = await axios.post("/api/user/login", {username, password});
            set({jwt: response.data});
            navigate("/");
            get().me();
        } catch (error) {
            console.error(error);
            throw new Error("Login failed");
        }
    },

    logout: () => {
        set({username: "anonymousUser"});
        set({jwt: ""});
        localStorage.removeItem("jwt");
    },

    register: async (username: string, password: string, repeatedPassword: string, navigate: NavigateFunction) => {
        const newUserData = {
            "username": `${username}`,
            "password": `${password}`
        }

        if (password === repeatedPassword) {

            return axios.post("/api/user/register", newUserData)
                .then(() => {
                    get().login(username, password, navigate)
                        .catch(console.error);
                })
                .catch((error) => {
                    console.error(error);
                    throw new Error("Registration failed");
                })
        }
    },

    isLoggedIn: () => {
        return get().username !== "anonymousUser";
    },

    // STORE END
}));

function authorisationHeader(jwt: string) {
    return {headers: {Authorization: jwt ? "Bearer " + jwt : ""}};
}
