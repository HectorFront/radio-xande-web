import { ExecutorRequest } from "@/http/executor"
import { RequestYouTubeStreamGetUnique } from "@/http/requests/stream"

export class ModelStream {

    static GetYouTubeStreamUnique(idChannel) {
        return new Promise((resolve, reject) => {
            ExecutorRequest(new RequestYouTubeStreamGetUnique(idChannel))
                .then(response => resolve(response))
                .catch(err => reject(err.status));
        })
    }
}