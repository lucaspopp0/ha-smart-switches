import React from "react"
import { Config } from "../../api";
import { Modal, Button, message } from "antd";
import { z } from "zod";
import { AutoForm } from "uniforms-antd";
import ZodBridge from "uniforms-bridge-zod";

// Define the schema using zod
const switchSchema = z.object({
  name: z.string()
    .min(1, "Switch name is required")
    .max(50, "Name must be 50 characters or less")
});

// Create the bridge using the simplified zod helper
const bridge = new ZodBridge({ schema: switchSchema });

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
        schema={bridge}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default NewSwitchModal;
