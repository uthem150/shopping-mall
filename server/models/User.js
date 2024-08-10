const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //비밀번호를 해싱하기 위한 라이브러리
const saltRounds = 10; //bcrypt 해시 함수에 사용될 salt의 라운드 수를 설정
const jwt = require("jsonwebtoken"); //JSON 웹 토큰을 생성하고 검증하는 라이브러리
const moment = require("moment"); //날짜, 시간 라이브러리

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //빈칸 없애주는 역할
    unique: 1, //동일한 email을 쓰지 못하도록
  },
  password: {
    type: String,
    minlength: 6,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  // 관리자와 일반 유저 구분 위함
  role: {
    type: Number,
    default: 0, //지정하지 않으면, 기본값 0
  },
  cart: {
    type: Array,
    default: [],
  },
  history: {
    type: Array,
    default: [],
  },
  image: String,
  // 유효성 관리 위한 token
  token: {
    type: String,
  },
  //토큰 유효기간
  tokenExp: {
    type: Number,
  },
});

//DB에 저장하기 전에 할 작업 정의. 작업을 끝난 뒤에는 next로 이동
//사용자가 저장되기 전에 비밀번호를 해시화하여 저장
userSchema.pre("save", function (next) {
  var user = this; //현재 저장 중인 사용자 문서

  //비밀번호가 수정되었을때만 해시화 작업 수행
  if (user.isModified("password")) {
    // console.log('password changed')
    //비밀번호 해시를 위한 salt 생성
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      //주어진 솔트를 사용하여 비밀번호를 해시화
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        //해시화된 비밀번호를 사용자 문서의 비밀번호 필드에 할당
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword) {
  //받은 PW를 암호화해서, DB에 저장된 암호화된 PW와 비교
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.generateToken = async function () {
  var user = this; //현재 사용자 문서 '참조'
  //   console.log("user", user);
  //   console.log("userSchema", userSchema);

  var token = jwt.sign(user._id.toHexString(), "secret"); //jsonwebtoken의 sign메소드 이용해서, token 생성
  var oneHour = moment().add(1, "hour").valueOf(); //현재 시간을 기준으로 1시간 후의 타임스탬프 계산

  user.tokenExp = oneHour; //만료 시간(oneHour)을 user 객체의 tokenExp 속성에 저장
  user.token = token; // 생성된 토큰을 user 객체의 token 필드에 저장

  try {
    await user.save();
    return user;
  } catch (err) {
    throw err;
  }
};

userSchema.statics.findByToken = function (token, cb) {
  //호출된 현재 모델 참조
  var user = this;

  //"secret"은 토큰을 검증하는 데 사용되는 비밀 키
  //token, "secret" 사용하여 토큰을 검증 (성공하면 decoded 변수에 디코딩된 토큰 데이터가 저장)
  //검증이 성공하면 decode 변수에 디코딩된 토큰의 내용이 저장됨
  jwt.verify(token, "secret", async function (err, decode) {
    if (err) return cb(err);

    try {
      //user.findOne 메서드를 사용하여 디코딩된 _id와 token을 기준으로 사용자를 찾음
      //exec() 메서드를 사용하여 쿼리 실행
      let foundUser = await user.findOne({ _id: decode, token: token }).exec();
      cb(null, foundUser);
    } catch (err) {
      cb(err);
    }
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
