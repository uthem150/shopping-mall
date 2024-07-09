import React, { useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ProfileEdit = ({ userInfo, onCancel, onSave }) => {
  const [form] = Form.useForm(); //Form 인스턴스 생성
  const [fileList, setFileList] = useState([]);

  //파일 업로드 시, 파일 리스트 업데이트
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Form form={form} onFinish={onSave} initialValues={userInfo}>
      <Form.Item
        name="name"
        label="Name"
        rules={[
          { required: true, message: "Please input your name!" },
          { max: 15, message: "Name cannot be longer than 15 characters!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="image" label="Profile Image">
        <Upload
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
          fileList={fileList} //파일을 업로드하지 않고 리스트에만 추가하도록
          onChange={handleUploadChange}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: "10px" }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileEdit;
