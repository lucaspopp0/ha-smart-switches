# Config


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**$schema** | **string** | A URL to the JSON Schema for this object. | [optional] [readonly] [default to undefined]
**switches** | [**{ [key: string]: Switch; }**](Switch.md) |  | [default to undefined]

## Example

```typescript
import { Config } from '@smart-switches/server';

const instance: Config = {
    $schema,
    switches,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
