import { ExecutorRequest } from "@/http/executor"
import { RequestKickTVStreamGetStatus, RequestYouTubeStreamGetStatus } from "@/http/requests/stream"

export class ModelStream {

    static GetYouTubeStreamStatus() {
        return new Promise((resolve, reject) => {
            ExecutorRequest(new RequestYouTubeStreamGetStatus())
                .then(response => resolve(response))
                .catch(err => reject(err.status));
        })
    }

    static GetKickTVStreamStatus() {
        return new Promise((resolve, reject) => {
            ExecutorRequest(new RequestKickTVStreamGetStatus())
                .then(response => resolve(response))
                .catch(err => reject(err.status));
        })
    }
}