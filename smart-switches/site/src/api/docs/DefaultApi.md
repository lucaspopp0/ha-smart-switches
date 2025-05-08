# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getConfig**](#getconfig) | **GET** /api/config | |
|[**listExecutables**](#listexecutables) | **GET** /api/executables | |
|[**press**](#press) | **POST** /api/press | |
|[**putConfig**](#putconfig) | **PUT** /api/config | |

# **getConfig**
> Config getConfig()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '@smart-switches/server';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getConfig();
```

### Parameters
This endpoint does not have any parameters.


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
|**200** | OK |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listExecutables**
> ListExecutablesResponseBody listExecutables()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '@smart-switches/server';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.listExecutables();
```

### Parameters
This endpoint does not have any parameters.


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
|**200** | OK |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **press**
> any press(PostPressRequestBody)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PostPressRequestBody
} from '@smart-switches/server';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let PostPressRequestBody: PostPressRequestBody; //

const { status, data } = await apiInstance.press(
    PostPressRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **PostPressRequestBody** | **PostPressRequestBody**|  | |


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
|**200** | OK |  -  |
|**422** | Unprocessable Entity |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **putConfig**
> Config putConfig(Config)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    Config
} from '@smart-switches/server';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let Config: Config; //

const { status, data } = await apiInstance.putConfig(
    Config
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **Config** | **Config**|  | |


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
|**200** | OK |  -  |
|**422** | Unprocessable Entity |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

