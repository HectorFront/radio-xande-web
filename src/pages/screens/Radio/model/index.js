import { ExecutorRequest } from "@/http/executor"
import { RequestGetPostMusic } from "@/http/requests/musics"

export class ModelMusics {

    static GetPostMusic() {
        return new Promise((resolve, reject) => {
            ExecutorRequest(new RequestGetPostMusic())
                .then(response => resolve(response))
                .catch(err => reject(err.status));
        })
    }

    static GetUniquePostMusic(id) {

    }
}