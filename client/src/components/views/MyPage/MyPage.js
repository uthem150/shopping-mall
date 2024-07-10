import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Button, message, Spin, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../../_actions/user_actions";
import ProfileEdit from "./ProfileEdit";
import PasswordEdit from "./PasswordEdit";

const { Title } = Typography;

function MyPage() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  useEffect(() => {
    // 로그인된 사용자 정보 가져오기
    if (user.userData && user.userData.isAuth) {
      setUserInfo(user.userData);
      setLoading(false);
    } else if (loading && user.userData === undefined) {
      // 로딩 중인 경우
      setLoading(true);
    } else {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      navigate("/login");
    }
  }, [user, navigate, loading]);

  console.log(user.userData);

  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  const handleCancelProfile = () => {
    setEditingProfile(false);
  };

  const handleEditPassword = () => {
    setEditingPassword(true);
  };

  const handleCancelPassword = () => {
    setEditingPassword(false);
  };

  const handleSaveProfile = (values) => {
    const dataToSubmit = {
      _id: userInfo._id,
      name: values.name,
      image: values.image ? values.image : userInfo.image,
    };

    dispatch(updateUser(dataToSubmit)).then((response) => {
      if (response.payload.success) {
        setUserInfo({ ...userInfo, ...dataToSubmit });
        setEditingProfile(false);
        message.success("Profile updated successfully!");
      } else {
        message.error(response.payload.err);
      }
    });
  };

  const handleSavePassword = (values) => {
    const dataToSubmit = {
      _id: userInfo._id,
      password: values.password,
      currentPassword: values.currentPassword,
    };
    //Redux의 dispatch를 사용하여 updateUser 액션을 호출
    dispatch(updateUser(dataToSubmit))
      .then((response) => {
        if (response.payload.success) {
          setEditingPassword(false);
          message.success("Password updated successfully!");
        }
      })
      .catch((error) => {
        const errorMessage = error.response.data.err;
        // 서버에서 반환된 오류 메시지를 사용자에게 보여줌
        if (errorMessage === "Current password is incorrect") {
          message.error("현재 비밀번호가 일치하지 않습니다.");
        } else if (errorMessage && errorMessage.errmsg) {
          message.error(errorMessage.errmsg);
        } else {
          message.error("알 수 없는 오류가 발생했습니다.");
        }
      });
  };

  return (
    <div
      style={{
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Title level={2} style={{ marginBottom: "30px" }}>
        My Page
      </Title>
      {loading ? (
        <Spin size="large" /> // 로딩 애니메이션
      ) : (
        <Card style={{ width: "95%", maxWidth: "600px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {!editingProfile && (
              <img
                src={userInfo.image}
                alt="user"
                style={{
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  marginBottom: "20px",
                }}
              />
            )}
            <div style={{ fontSize: "17px", textAlign: "center" }}>
              {!editingProfile ? (
                <>
                  <p>
                    <strong>Email:</strong> {userInfo.email}
                  </p>
                  <p>
                    <strong>Name:</strong> {userInfo.name}
                  </p>
                  {!editingPassword && (
                    <>
                      <Button
                        type="primary"
                        onClick={handleEditProfile}
                        style={{ margin: "5px" }}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        onClick={handleEditPassword}
                        style={{ margin: "5px" }}
                      >
                        Change Password
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <ProfileEdit
                  userInfo={userInfo}
                  onCancel={handleCancelProfile}
                  onSave={handleSaveProfile}
                />
              )}
              {editingPassword && (
                <PasswordEdit
                  onCancel={handleCancelPassword}
                  onSave={handleSavePassword}
                />
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default MyPage;
