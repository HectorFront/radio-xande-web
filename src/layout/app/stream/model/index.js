import { ExecutorRequest } from "@/http/executor"
import { RequestYouTubeStreamGetUnique } from "@/http/requests/stream"

export class ModelStream {

    static GetYouTubeStreamUnique() {
        return new Promise((resolve, reject) => {
            ExecutorRequest(new RequestYouTubeStreamGetUnique())
                .then(response => resolve(response))
                .catch(err => reject(err.status));
        })
    }
}