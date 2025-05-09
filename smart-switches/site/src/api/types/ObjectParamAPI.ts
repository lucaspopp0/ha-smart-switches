import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from '../middleware';

import { Config } from '../models/Config';
import { ErrorDetail } from '../models/ErrorDetail';
import { ErrorModel } from '../models/ErrorModel';
import { Executable } from '../models/Executable';
import { LayoutV4 } from '../models/LayoutV4';
import { LayoutV5 } from '../models/LayoutV5';
import { LayoutV6 } from '../models/LayoutV6';
import { LayoutV7 } from '../models/LayoutV7';
import { Layouts } from '../models/Layouts';
import { ListExecutablesResponseBody } from '../models/ListExecutablesResponseBody';
import { PostPressRequestBody } from '../models/PostPressRequestBody';
import { Switch } from '../models/Switch';
import { WheelRoutine } from '../models/WheelRoutine';

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiGetConfigRequest {
}

export interface DefaultApiListExecutablesRequest {
}

export interface DefaultApiPressRequest {
    /**
     * 
     * @type PostPressRequestBody
     * @memberof DefaultApipress
     */
    PostPressRequestBody: PostPressRequestBody
}

export interface DefaultApiPutConfigRequest {
    /**
     * 
     * @type Config
     * @memberof DefaultApiputConfig
     */
    Config: Config
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public getConfigWithHttpInfo(param: DefaultApiGetConfigRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<Config>> {
        return this.api.getConfigWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getConfig(param: DefaultApiGetConfigRequest = {}, options?: ConfigurationOptions): Promise<Config> {
        return this.api.getConfig( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public listExecutablesWithHttpInfo(param: DefaultApiListExecutablesRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<ListExecutablesResponseBody>> {
        return this.api.listExecutablesWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public listExecutables(param: DefaultApiListExecutablesRequest = {}, options?: ConfigurationOptions): Promise<ListExecutablesResponseBody> {
        return this.api.listExecutables( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public pressWithHttpInfo(param: DefaultApiPressRequest, options?: ConfigurationOptions): Promise<HttpInfo<any>> {
        return this.api.pressWithHttpInfo(param.PostPressRequestBody,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public press(param: DefaultApiPressRequest, options?: ConfigurationOptions): Promise<any> {
        return this.api.press(param.PostPressRequestBody,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public putConfigWithHttpInfo(param: DefaultApiPutConfigRequest, options?: ConfigurationOptions): Promise<HttpInfo<Config>> {
        return this.api.putConfigWithHttpInfo(param.Config,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public putConfig(param: DefaultApiPutConfigRequest, options?: ConfigurationOptions): Promise<Config> {
        return this.api.putConfig(param.Config,  options).toPromise();
    }

}
