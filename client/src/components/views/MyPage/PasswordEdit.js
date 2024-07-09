import React from "react";
import { Form, Input, Button } from "antd";

const PasswordEdit = ({ onCancel, onSave }) => {
  const [form] = Form.useForm();

  //보통 rule 객체를 받지만, 이 함수에서는 안쓰므로 (_)로 표기하여 무시
  const validateConfirmPassword = (_, value) => {
    if (!value || form.getFieldValue("newPassword") === value) {
      //확인 비밀번호 필드가 비어 있으면, 그냥 통과
      //새 비밀번호 == 확인 비밀번호 일치하면 통과
      return Promise.resolve();
    }
    return Promise.reject(
      new Error("The two passwords that you entered do not match!")
    );
  };

  const onFinish = (values) => {
    const { currentPassword, newPassword } = values;
    onSave({ currentPassword, password: newPassword });
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="currentPassword"
        label="Current Password"
        rules={[
          { required: true, message: "Please input your current password!" },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label="New Password"
        rules={[
          { required: true, message: "Please input your new password!" },
          { min: 6, message: "Password must be at least 6 characters long!" },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label="Confirm New Password"
        dependencies={["newPassword"]} //"newPassword" 필드를 참조하도록 해서, newPassword 필드의 값이 변경될 때마다 유효성 검사 실행되도록
        rules={[
          { required: true, message: "Please confirm your new password!" },
          { min: 6, message: "Password must be at least 6 characters long!" },
          { validator: validateConfirmPassword },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save Password
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: "10px" }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PasswordEdit;
