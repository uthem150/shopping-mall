import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from "formik"; //form 검증 라이브러리
import * as Yup from "yup";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

const { Title } = Typography; //제목 컴포넌트 가져옴

function LoginPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //로컬 스토리지에서 rememberMe 값 있는지 확인 (이메일 들어있음)
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(rememberMeChecked); //Remember me 체크박스 상태

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  //이메일을 초기 값으로, 로컬 스토리지에 저장된 값 설정
  const initialEmail = localStorage.getItem("rememberMe")
    ? localStorage.getItem("rememberMe")
    : "";

  return (
    <Formik
      initialValues={{
        email: initialEmail, //Formik의 초기 값 설정(rememberMe 했으면, email들어있음)
        password: "",
      }}
      //Yup을 사용하여 폼 검증 스키마 정의
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Email is invalid")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      })}
      //values에는 폼에 입력된 값들 들어감, setSubmitting은 폼 제출 상태를 변경하는 함수
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password,
          };
          //로그인 요청 보냄
          dispatch(loginUser(dataToSubmit))
            .then((response) => {
              //로그인 성공
              if (response.payload.loginSuccess) {
                window.localStorage.setItem("userId", response.payload.userId); //userId를 localStorage에 저장
                if (rememberMe === true) {
                  window.localStorage.setItem("rememberMe", values.email);
                } else {
                  localStorage.removeItem("rememberMe");
                }
                navigate("/"); //홈페이지로 이동
              } else {
                setFormErrorMessage("Check out your Account or Password again");
              }
            })
            .catch((err) => {
              setFormErrorMessage("Check out your Account or Password again");
              //3초 후에 에러 메시지를 지움
              setTimeout(() => {
                setFormErrorMessage("");
              }, 3000);
            });
          //폼 제출 상태를 false로 변경
          setSubmitting(false);
        }, 500);
      }}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur, //폼 필드가 focus를 잃었을 때의 이벤트 처리
          handleSubmit,
          handleReset,
        } = props;
        return (
          <div className="app">
            <Title level={2}>Log In</Title>
            <form onSubmit={handleSubmit} style={{ width: "350px" }}>
              <Form.Item required>
                <Input
                  id="email"
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  placeholder="Enter your email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email
                      ? "text-input error"
                      : "text-input"
                  }
                />
                {/* errors.email, touched.email을 확인하여 유효성 검사 오류 메시지 표시 */}
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </Form.Item>

              <Form.Item required>
                <Input
                  id="password"
                  prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  placeholder="Enter your password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password
                      ? "text-input error"
                      : "text-input"
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>

              {/* formErrorMessage가 존재할 경우, 오류 메시지 표시 */}
              {formErrorMessage && (
                <label>
                  <p
                    style={{
                      color: "#ff0000bf",
                      fontSize: "0.7rem",
                      border: "1px solid",
                      padding: "1rem",
                      borderRadius: "10px",
                    }}
                  >
                    {formErrorMessage}
                  </p>
                </label>
              )}

              <Form.Item style={{ margin: "40px 0px" }}>
                <Checkbox
                  id="rememberMe"
                  onChange={handleRememberMe}
                  checked={rememberMe}
                >
                  Remember me
                </Checkbox>
                <a
                  className="login-form-forgot"
                  href="/reset_user"
                  style={{ float: "right" }}
                >
                  forgot password
                </a>
                <div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{ minWidth: "100%", margin: "5px 0px" }}
                    disabled={isSubmitting}
                    onSubmit={handleSubmit}
                  >
                    Log in
                  </Button>
                </div>
                Or <a href="/register">register now!</a>
              </Form.Item>
            </form>
          </div>
        );
      }}
    </Formik>
  );
}

export default LoginPage;
