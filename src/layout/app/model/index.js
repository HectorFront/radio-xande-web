import { ExecutorRequest } from "@/http/executor";
import { RequestGetUniqueAd } from "@/http/requests/ad";

export class ModelApp {

    static GetUniqueAd() {
        return new Promise((resolve, reject) => {
            ExecutorRequest(new RequestGetUniqueAd())
                .then(response => resolve(response))
                .catch(err => reject(err.status));
        })
    }
}