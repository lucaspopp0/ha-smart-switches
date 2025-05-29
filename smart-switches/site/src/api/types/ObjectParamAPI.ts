import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from '../middleware';

import { Config } from '../models/Config';
import { Device } from '../models/Device';
import { ErrorDetail } from '../models/ErrorDetail';
import { ErrorModel } from '../models/ErrorModel';
import { Executable } from '../models/Executable';
import { LayoutV4 } from '../models/LayoutV4';
import { LayoutV5 } from '../models/LayoutV5';
import { LayoutV6 } from '../models/LayoutV6';
import { LayoutV7 } from '../models/LayoutV7';
import { Layouts } from '../models/Layouts';
import { ListBLEDevicesResponseBody } from '../models/ListBLEDevicesResponseBody';
import { ListExecutablesResponseBody } from '../models/ListExecutablesResponseBody';
import { PostPressRequestBody } from '../models/PostPressRequestBody';
import { StartBLEScanRequestBody } from '../models/StartBLEScanRequestBody';
import { StartBLEScanResponseBody } from '../models/StartBLEScanResponseBody';
import { StopBLEScanResponseBody } from '../models/StopBLEScanResponseBody';
import { Switch } from '../models/Switch';
import { WheelRoutine } from '../models/WheelRoutine';

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiGetConfigRequest {
}

export interface DefaultApiListBleDevicesRequest {
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

export interface DefaultApiStartBleScanRequest {
    /**
     * 
     * @type StartBLEScanRequestBody
     * @memberof DefaultApistartBleScan
     */
    StartBLEScanRequestBody: StartBLEScanRequestBody
}

export interface DefaultApiStopBleScanRequest {
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
     * Get a list of all BLE devices discovered during scanning
     * List discovered BLE devices
     * @param param the request object
     */
    public listBleDevicesWithHttpInfo(param: DefaultApiListBleDevicesRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<ListBLEDevicesResponseBody>> {
        return this.api.listBleDevicesWithHttpInfo( options).toPromise();
    }

    /**
     * Get a list of all BLE devices discovered during scanning
     * List discovered BLE devices
     * @param param the request object
     */
    public listBleDevices(param: DefaultApiListBleDevicesRequest = {}, options?: ConfigurationOptions): Promise<ListBLEDevicesResponseBody> {
        return this.api.listBleDevices( options).toPromise();
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

    /**
     * Start scanning for BLE devices that can act as peripherals
     * Start BLE device scan
     * @param param the request object
     */
    public startBleScanWithHttpInfo(param: DefaultApiStartBleScanRequest, options?: ConfigurationOptions): Promise<HttpInfo<StartBLEScanResponseBody>> {
        return this.api.startBleScanWithHttpInfo(param.StartBLEScanRequestBody,  options).toPromise();
    }

    /**
     * Start scanning for BLE devices that can act as peripherals
     * Start BLE device scan
     * @param param the request object
     */
    public startBleScan(param: DefaultApiStartBleScanRequest, options?: ConfigurationOptions): Promise<StartBLEScanResponseBody> {
        return this.api.startBleScan(param.StartBLEScanRequestBody,  options).toPromise();
    }

    /**
     * Stop the current BLE device scan
     * Stop BLE device scan
     * @param param the request object
     */
    public stopBleScanWithHttpInfo(param: DefaultApiStopBleScanRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<StopBLEScanResponseBody>> {
        return this.api.stopBleScanWithHttpInfo( options).toPromise();
    }

    /**
     * Stop the current BLE device scan
     * Stop BLE device scan
     * @param param the request object
     */
    public stopBleScan(param: DefaultApiStopBleScanRequest = {}, options?: ConfigurationOptions): Promise<StopBLEScanResponseBody> {
        return this.api.stopBleScan( options).toPromise();
    }

}
