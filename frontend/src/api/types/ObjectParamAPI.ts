import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'


import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiTestGetRequest {
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * test endpoint
     * Returns a number
     * @param param the request object
     */
    public testGet(param: DefaultApiTestGetRequest = {}, options?: Configuration): Promise<number> {
        return this.api.testGet( options).toPromise();
    }

}
