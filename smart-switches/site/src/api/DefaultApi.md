# .DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getConfig**](DefaultApi.md#getConfig) | **GET** /api/config | 
[**listExecutables**](DefaultApi.md#listExecutables) | **GET** /api/executables | 
[**press**](DefaultApi.md#press) | **POST** /api/press | 
[**putConfig**](DefaultApi.md#putConfig) | **PUT** /api/config | 


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
            _1: "_1_example",
            _2: "_2_example",
            _3: "_3_example",
            _4: "_4_example",
            _5: "_5_example",
            _6: "_6_example",
            _7: "_7_example",
            _8: "_8_example",
            off: "off_example",
            on: "on_example",
          },
          v5: {
            _5: "_5_example",
            _6: "_6_example",
            _7: "_7_example",
            _8: "_8_example",
            flipped: true,
            off: "off_example",
            on: "on_example",
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
            _5: "_5_example",
            _6: "_6_example",
            _7: "_7_example",
            _8: "_8_example",
            flipped: true,
            off: "off_example",
            on: "on_example",
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
            _1: "_1_example",
            _2: "_2_example",
            _3: "_3_example",
            _4: "_4_example",
            _5: "_5_example",
            _6: "_6_example",
            _7: "_7_example",
            _8: "_8_example",
            flipped: true,
            off: "off_example",
            on: "on_example",
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


