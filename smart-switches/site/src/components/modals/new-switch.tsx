import React from "react"
import { Config } from "../../api";
import { Modal, Button, message } from "antd";
import { z } from "zod";
import { AutoForm } from "uniforms-antd";
import { zodToJsonSchema } from "uniforms-bridge-zod";
import { JSONSchemaBridge } from "uniforms-bridge-json-schema";

// Define the schema using zod
const switchSchema = z.object({
  name: z.string()
    .min(1, "Switch name is required")
    .max(50, "Name must be 50 characters or less")
});

// Convert to JSON schema for uniforms
const jsonSchema = zodToJsonSchema(switchSchema);

// Create the bridge for uniforms
const bridge = new JSONSchemaBridge({
  schema: jsonSchema,
  validator: {
    clean: (model: any) => model,
    validate: (model: any) => {
      try {
        switchSchema.parse(model);
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { details: error.errors.map(err => ({
            name: err.path.join('.'),
            message: err.message,
          }))};
        }
        return { details: [{ name: '_error', message: 'Unknown error' }] };
      }
    },
    validateOne: (model: any, field: string) => {
      try {
        const fieldSchema = switchSchema.shape[field];
        if (fieldSchema) {
          fieldSchema.parse(model[field]);
        } else {
          switchSchema.parse(model);
        }
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find(err => 
            err.path[0] === field || err.path.join('.') === field
          );
          return fieldError?.message || null;
        }
        return 'Unknown error';
      }
    }
  }
});

export type NewSwitchModalProps = {
  show?: boolean,
  onShow?: () => void,
  onHide?: () => void,
  onConfirm?: (remoteName: string) => Promise<Config>,
}

const NewSwitchModal: React.FC<NewSwitchModalProps> = (props) => {
  const formRef = React.useRef<any>(null);
  
  const onShow = props.onShow ?? (() => {});
  const onHide = props.onHide ?? (() => {});
  
  const handleSubmit = async (model: { name: string }) => {
    const onConfirm = props.onConfirm ?? (async (_: string) => {});
    
    try {
      await onConfirm(model.name);
      onHide();
    } catch (error) {
      message.error(`Failed to add switch: ${String(error)}`);
    }
  };

  return (
    <Modal
      title="Add Switch"
      open={props.show}
      afterOpenChange={(visible) => {
        if (visible) {
          onShow();
        }
      }}
      onCancel={onHide}
      footer={[
        <Button key="cancel" onClick={onHide}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary"
          onClick={() => {
            if (formRef.current) {
              formRef.current.submit();
            }
          }}
        >
          Save
        </Button>
      ]}
    >
      <AutoForm
        ref={formRef}
        schema={bridge}
        onSubmit={handleSubmit}
        onKeyDown={(event: React.KeyboardEvent) => {
          if (event.key === "Enter") {
            event.preventDefault();
            if (formRef.current) {
              formRef.current.submit();
            }
          }
        }}
      />
    </Modal>
  );
};

export default NewSwitchModal;