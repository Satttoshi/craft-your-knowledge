import {useStore} from "../hooks/useStore.ts";
import {Workshop} from "../utils/types.ts";

type Props = {
    workshop: Workshop;
}

export default function LikeStar({workshop}: Props) {

    const updatePersonalStatus = useStore(state => state.updatePersonalStatus);

    function handleClick() {
        const newPersonalStatus = {
            ...workshop.personalStatuses[0],
            isLiked: !workshop.personalStatuses[0].isLiked
        }
        updatePersonalStatus(workshop.id, newPersonalStatus)
    }

    return (<>
        <div onClick={handleClick}>
            {
                workshop.personalStatuses[0].isLiked ?

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48px" height="48px"
                         fill="orange">
                        <title>star</title>
                        <path
                            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48px" height="48px"
                         fill="orange">
                        <title>star-outline</title>
                        <path
                            d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z"/>
                    </svg>
            }
        </div>
    </>)
}