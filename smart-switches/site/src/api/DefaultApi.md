# .DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getConfig**](DefaultApi.md#getConfig) | **GET** /api/config | 
[**listBleDevices**](DefaultApi.md#listBleDevices) | **GET** /api/ble/devices | List discovered BLE devices
[**listExecutables**](DefaultApi.md#listExecutables) | **GET** /api/executables | 
[**press**](DefaultApi.md#press) | **POST** /api/press | 
[**putConfig**](DefaultApi.md#putConfig) | **PUT** /api/config | 
[**startBleScan**](DefaultApi.md#startBleScan) | **POST** /api/ble/scan/start | Start BLE device scan
[**stopBleScan**](DefaultApi.md#stopBleScan) | **POST** /api/ble/scan/stop | Stop BLE device scan


# **getConfig**
> Config getConfig()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.getConfig(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**Config**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listBleDevices**
> ListBLEDevicesResponseBody listBleDevices()

Get a list of all BLE devices discovered during scanning

### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.listBleDevices(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ListBLEDevicesResponseBody**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listExecutables**
> ListExecutablesResponseBody listExecutables()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.listExecutables(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ListExecutablesResponseBody**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **press**
> any press(PostPressRequestBody)


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiPressRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiPressRequest = {
  
  PostPressRequestBody: {
    key: "key_example",
    layout: "layout_example",
    _switch: "_switch_example",
  },
};

const data = await apiInstance.press(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **PostPressRequestBody** | **PostPressRequestBody**|  |


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**422** | Unprocessable Entity |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **putConfig**
> Config putConfig(Config)


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiPutConfigRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiPutConfigRequest = {
  
  Config: {
    switches: {
      "key": {
        layouts: {
          v4: {
            _1: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _2: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _3: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _4: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _5: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _6: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _7: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _8: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            off: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            on: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
          },
          v5: {
            _5: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _6: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _7: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _8: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            flipped: true,
            off: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            on: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            wheel_routines: [
              {
                command: "command_example",
                name: "name_example",
                rgb: [
                  1,
                ],
              },
            ],
          },
          v6: {
            _5: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _6: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _7: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _8: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            flipped: true,
            off: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            on: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            wheel_routines: [
              {
                command: "command_example",
                name: "name_example",
                rgb: [
                  1,
                ],
              },
            ],
          },
          v7: {
            _1: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _2: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _3: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _4: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _5: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _6: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _7: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            _8: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            flipped: true,
            off: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
            on: {
              cmd: "cmd_example",
              color: [
                1,
              ],
            },
          },
        },
      },
    },
  },
};

const data = await apiInstance.putConfig(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Config** | **Config**|  |


### Return type

**Config**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**422** | Unprocessable Entity |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **startBleScan**
> StartBLEScanResponseBody startBleScan(StartBLEScanRequestBody)

Start scanning for BLE devices that can act as peripherals

### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiStartBleScanRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiStartBleScanRequest = {
  
  StartBLEScanRequestBody: {
    duration: 1,
  },
};

const data = await apiInstance.startBleScan(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **StartBLEScanRequestBody** | **StartBLEScanRequestBody**|  |


### Return type

**StartBLEScanResponseBody**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**422** | Unprocessable Entity |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **stopBleScan**
> StopBLEScanResponseBody stopBleScan()

Stop the current BLE device scan

### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.stopBleScan(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**StopBLEScanResponseBody**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


