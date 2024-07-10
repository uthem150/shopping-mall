import React, { useState } from "react";
import { Form, Input, Button, Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";

const ProfileEdit = ({ userInfo, onCancel, onSave }) => {
  const [form] = Form.useForm(); //Form 인스턴스 생성
  //   const [fileList, setFileList] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);

  //   // 파일 업로드 시, 파일 리스트 업데이트
  //   const handleUploadChange = ({ fileList }) => {
  //     setFileList(fileList);
  //   };

  const handleSave = (values) => {
    const dataToSubmit = {
      ...values,
      image: avatarUrl || userInfo.image,
    };
    onSave(dataToSubmit);
    console.log(dataToSubmit);
  };

  // 새로운 아바타 이미지를 생성하여 fileList에 추가
  const handleGenerateAvatar = () => {
    const newAvatarUrl = `http://gravatar.com/avatar/${moment().unix()}?d=identicon`;
    const newAvatar = {
      uid: `-${moment().unix()}`, // 고유 ID
      name: `avatar_${moment().unix()}.png`,
      status: "done",
      url: newAvatarUrl,
    };

    // setFileList([newAvatar]);
    setAvatarUrl(newAvatarUrl);
  };

  return (
    <Form form={form} onFinish={handleSave} initialValues={userInfo}>
      <div style={{ marginBottom: "15px" }}>
        <Image
          width={80}
          src={avatarUrl || userInfo.image}
          alt="Generated Avatar"
          style={{ borderRadius: "50%" }}
        />
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleGenerateAvatar}
        style={{
          marginBottom: "20px",
          backgroundColor: "#1890ff",
          borderColor: "#1890ff",
        }}
      >
        Generate Avatar
      </Button>
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
      {/* <Form.Item name="image" label="Profile Image">
        <Upload
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
          fileList={fileList} //파일을 업로드하지 않고 리스트에만 추가하도록
          onChange={handleUploadChange}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item> */}
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
