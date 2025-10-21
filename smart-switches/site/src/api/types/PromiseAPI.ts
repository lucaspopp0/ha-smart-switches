import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, PromiseConfigurationOptions, wrapOptions } from '../configuration'
import { PromiseMiddleware, Middleware, PromiseMiddlewareWrapper } from '../middleware';

import { Command } from '../models/Command';
import { Config } from '../models/Config';
import { Device } from '../models/Device';
import { ErrorDetail } from '../models/ErrorDetail';
import { ErrorModel } from '../models/ErrorModel';
import { Executable } from '../models/Executable';
import { LayoutV4 } from '../models/LayoutV4';
import { LayoutV5 } from '../models/LayoutV5';
import { LayoutV6 } from '../models/LayoutV6';
import { LayoutV7 } from '../models/LayoutV7';
import { LayoutV9 } from '../models/LayoutV9';
import { Layouts } from '../models/Layouts';
import { ListBLEDevicesResponseBody } from '../models/ListBLEDevicesResponseBody';
import { ListExecutablesResponseBody } from '../models/ListExecutablesResponseBody';
import { PostPressRequestBody } from '../models/PostPressRequestBody';
import { StartBLEScanRequestBody } from '../models/StartBLEScanRequestBody';
import { StartBLEScanResponseBody } from '../models/StartBLEScanResponseBody';
import { StopBLEScanResponseBody } from '../models/StopBLEScanResponseBody';
import { Switch } from '../models/Switch';
import { WheelRoutine } from '../models/WheelRoutine';
import { ObservableDefaultApi } from './ObservableAPI';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public getConfigWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<Config>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getConfigWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     */
    public getConfig(_options?: PromiseConfigurationOptions): Promise<Config> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getConfig(observableOptions);
        return result.toPromise();
    }

    /**
     * Get a list of all BLE devices discovered during scanning
     * List discovered BLE devices
     */
    public listBleDevicesWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<ListBLEDevicesResponseBody>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listBleDevicesWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Get a list of all BLE devices discovered during scanning
     * List discovered BLE devices
     */
    public listBleDevices(_options?: PromiseConfigurationOptions): Promise<ListBLEDevicesResponseBody> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listBleDevices(observableOptions);
        return result.toPromise();
    }

    /**
     */
    public listExecutablesWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<ListExecutablesResponseBody>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listExecutablesWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     */
    public listExecutables(_options?: PromiseConfigurationOptions): Promise<ListExecutablesResponseBody> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listExecutables(observableOptions);
        return result.toPromise();
    }

    /**
     * @param PostPressRequestBody
     */
    public pressWithHttpInfo(PostPressRequestBody: PostPressRequestBody, _options?: PromiseConfigurationOptions): Promise<HttpInfo<any>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.pressWithHttpInfo(PostPressRequestBody, observableOptions);
        return result.toPromise();
    }

    /**
     * @param PostPressRequestBody
     */
    public press(PostPressRequestBody: PostPressRequestBody, _options?: PromiseConfigurationOptions): Promise<any> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.press(PostPressRequestBody, observableOptions);
        return result.toPromise();
    }

    /**
     * @param Config
     */
    public putConfigWithHttpInfo(Config: Config, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Config>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putConfigWithHttpInfo(Config, observableOptions);
        return result.toPromise();
    }

    /**
     * @param Config
     */
    public putConfig(Config: Config, _options?: PromiseConfigurationOptions): Promise<Config> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putConfig(Config, observableOptions);
        return result.toPromise();
    }

    /**
     * Start scanning for BLE devices that can act as peripherals
     * Start BLE device scan
     * @param StartBLEScanRequestBody
     */
    public startBleScanWithHttpInfo(StartBLEScanRequestBody: StartBLEScanRequestBody, _options?: PromiseConfigurationOptions): Promise<HttpInfo<StartBLEScanResponseBody>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.startBleScanWithHttpInfo(StartBLEScanRequestBody, observableOptions);
        return result.toPromise();
    }

    /**
     * Start scanning for BLE devices that can act as peripherals
     * Start BLE device scan
     * @param StartBLEScanRequestBody
     */
    public startBleScan(StartBLEScanRequestBody: StartBLEScanRequestBody, _options?: PromiseConfigurationOptions): Promise<StartBLEScanResponseBody> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.startBleScan(StartBLEScanRequestBody, observableOptions);
        return result.toPromise();
    }

    /**
     * Stop the current BLE device scan
     * Stop BLE device scan
     */
    public stopBleScanWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<StopBLEScanResponseBody>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.stopBleScanWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Stop the current BLE device scan
     * Stop BLE device scan
     */
    public stopBleScan(_options?: PromiseConfigurationOptions): Promise<StopBLEScanResponseBody> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.stopBleScan(observableOptions);
        return result.toPromise();
    }


}



