//include all dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { Op } = require("sequelize");
//const { getMatchedValue } = require("../helpers/MatchPermission");
const { UserExtention, User } = require("../utils/DB");

const getAllUser = async (req, res) => {
  try {
    // const limit = parseInt(req.params.limit);
    // const offset = parseInt(req.params.offset);

    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "created_at",
        "display_name",
      ],

      include: [
        {
          model: UserExtention,
          attributes: ["user_id", ["meta_value", "role"]],
          where: {
            meta_key: "permission",
          },
        },
      ],
      order: [["id", "DESC"]],
    });
    //console.log("users", users[0].dataValues.bden_user_extentions[0].dataValues);
    return res.status(200).json({ error: false, users: users });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: true, msg: "Server error." });
  }
};

const getUser = async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await User.findOne({
      where: { id: userid },
      attributes: [
        "id",
        "username",
        "email",
        "created_at",
        "display_name",
      ],

    });

    const userExtention = await UserExtention.findAll({where: {user_id: req.params.id}} );

    let userExtention_info = {};
    for await (info of userExtention) {
      userExtention_info[info.meta_key] = info.meta_value;
    }

    console.log('userExtention_info', userExtention_info)

    return res.status(200).json({ error: false, user: user, user_info: userExtention_info });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: true, msg: "Server error." });
  }
};

const register = async (req, res) => {
  //console.log("user", req.body);
  let {
    meta_key,
    meta_value,
    username,
    email,
    password,
    website,
    first_name,
    last_name,
    role,
    nickname,
    avatar,

  } = req.body;

  try {
    //checking email taken or not...
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      return res.status(400).json({ error: true, msg: "E-mail already taken" });
    }
    const userName = await User.findOne({ where: { username: username } });
    if (userName) {
      return res
        .status(400)
        .json({ error: true, msg: "Username already taken" });
    }

    const userRegistereDate = moment().format("YYYY-MM-DD h:mm:ss");

    let userPassword = bcrypt.hashSync(password, 12, (err, hash) => {
      if (err) {
        throw err;
      }
      return hash;
    });
    //user create with credentials...
    const newUser = await User.create({
      username,
      password: userPassword,
      nickname,
      email,
      website,
      created_at: userRegistereDate,
      display_name: first_name + " " + last_name,
      avatar: req.file.filename
    });

    await UserExtention.create({
      user_id: newUser.id,
      meta_key: "nickname",
      meta_value: newUser.nickname,
    });

    await UserExtention.create({
      user_id: newUser.id,
      meta_key: "first_name",
      meta_value: first_name,
    });

    await UserExtention.create({
      user_id: newUser.id,
      meta_key: "last_name",
      meta_value: last_name,
    });

    await UserExtention.create({
      user_id: newUser.id,
      meta_key: "bio",
      meta_value,
    });

    let permission = "subscriber";
    if (role) {
      permission = role;
    }

    await UserExtention.create({
      user_id: newUser.id,
      meta_key: "permission",
      meta_value: permission,
    });

    await UserExtention.create({
      user_id: newUser.id,
      meta_key: "avatar",
      meta_value:newUser.avatar,
    });

    await UserExtention.create({
      user_id: newUser.id,
      meta_key: "dob",
      meta_value,
    });

    await UserExtention.create({
      user_id: newUser.id,
      meta_key: "address",
      meta_value,
    });

    await UserExtention.create({
      user_id: newUser.id,
      meta_key: "phone",
      meta_value,
    });

    await UserExtention.create({
      user_id: newUser.id,
      meta_key: "facebook",
      meta_value,
    });

    await UserExtention.create({
      user_id: newUser.id,
      meta_key: "twitter",
      meta_value,
    });

    return res
      .status(201)
      .json({ error: false, msg: "User registerd Successfuly." });
  } catch (error) {
    //check for possible erros...
    console.log(error);
    res.status(500).json({ error: true, msg: "Server error." });
  }
};

const updateUser = async (req, res) => {
  try {
    console.log("data", req.body);

    const userid = req.params.id;
    //const UserExtentionid = req.params.user_id ;
    let old_user = await User.findOne({ where: { id: userid } });

    if (!old_user) {
      return res.status(200).json({ error: true, msg: "User not found." });
    }

    const {
     
      email,
      password,
      website,
      first_name,
      last_name,
      nickname,
      avatar,
      permission,
      role,
      phone,
      address,
      dob,
      facebook,
      twitter,

    } = req.body;

    if (
      nickname == "" ||
      nickname == null ||
      nickname == undefined
    ) {
      return res
        .status(200)
        .json({ error: true, msg: "Nickname is requrired." });
    }
    if (email == "" || email == null || email == undefined) {
      return res.status(200).json({ error: true, msg: "Email is requrired." });
    }
    if (password) {
      user_password = bcrypt.hashSync(password, 12, (err, hash) => {
        if (err) {
          throw err;
        }
        return hash;
      });
    }

    if (req.body.email !== old_user.email) {
      user_mail = await User.findOne({ where: { email: email } });
      if (user_mail) {
        return res
          .status(400)
          .json({ error: true, msg: "E-mail already taken" });
      }
    }

    old_user.nickname = nickname;
    if (password) {
      old_user.password = user_password;
    }
    old_user.email = email;
 
    old_user.display_name = first_name + " " + last_name;
    
    old_user.website = website;

    if (req.file) {
      console.log(req.file);
      old_user.avatar = req.file.filename;  
    }
    await old_user.save();


    let nicknameinfo = await UserExtention.findOne({
      where: { meta_key: "nickname", user_id: userid },
    });
    nicknameinfo.meta_value = old_user.nickname;
    nicknameinfo.save();

    if (first_name) {
      let first_nameinfo = await UserExtention.findOne({
        where: { meta_key: "first_name", user_id: userid },
      });
      //console.log( 'first_nameinfo', first_nameinfo);
      if (first_nameinfo) {
        first_nameinfo.meta_value = first_name;
        first_nameinfo.save();
      }
    }

    if (last_name) {
      let last_nameinfo = await UserExtention.findOne({
        where: { meta_key: "last_name", user_id: userid },
      });
      last_nameinfo.meta_value = last_name;
      last_nameinfo.save();
    }
    if (bio) {
      let bioinfo = await UserExtention.findOne({
        where: { meta_key: "bio", user_id: userid },
      });
      bioinfo.meta_value = bio;
      bioinfo.save();
    }

    if (permission) {
      let permissioninfo = await UserExtention.findOne({
        where: { meta_key: "permission", user_id: userid },
      });
      permissioninfo.meta_value = permission;
      permissioninfo.save();
    }

    if (req.file) {
      console.log(req.file);
      let avatarinfo = await UserExtention.findOne({
        where: { meta_key: "avatar", user_id: userid },
      });
      avatarinfo.meta_value = avatar;
      avatarinfo.save();
    }

    if (phone) {
      let phoneinfo = await UserExtention.findOne({
        where: { meta_key: "phone", user_id: userid },
      });
      phoneinfo.meta_value = phone;
      phoneinfo.save();
    }

    if (address) {
      let addressinfo = await UserExtention.findOne({
        where: { meta_key: "address", user_id: userid },
      });
      addressinfo.meta_value = address;
      addressinfo.save();
    }

    if (dob) {
      let dobinfo = await UserExtention.findOne({
        where: { meta_key: "dob", user_id: userid },
      });
      dobinfo.meta_value = dob;
      dobinfo.save();
    }


    if (facebook) {
      let facebookinfo = await UserExtention.findOne({
        where: { meta_key: "facebook", user_id: userid },
      });
      facebookinfo.meta_value = facebook;
      facebookinfo.save();
    }

    if (twitter) {
      let twitterinfo = await UserExtention.findOne({
        where: { meta_key: "twitter", user_id: userid },
      });
      twitterinfo.meta_value = twitter;
      twitterinfo.save();
    }

    return res.status(200).json({
      error: false,
      //data: updateUser,
      msg: "Profile updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, msg: err });
  }
};

//handler for logged in user...
const login = async (req, res) => {
  console.log("login", req.body);
  const { email, password } = req.body;

  try {
    //checking email registerd or not...
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ error: true, msg: "Invalid credentials." });
    }
    //checking for password match..
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ error: true, msg: "Invalid credentials" });
    }
    //checking permission
    const userExtention = await UserExtention.findOne({
      where: { meta_key: "permission", user_id: user.id },
    });
    if (!userExtention) {
      return res.status(400).json({ error: true, msg: "Invalid credentials." });
    }

    //create payload 
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        permission: userExtention.meta_value,
      },
    };

    //let token = "";
    jwt.sign( payload, process.env.JWTSECRET, { expiresIn: "24h" },
      (error, token) => {
        if (error) {
          throw error;
        }
        console.log(token);
        return res.status(200).json({
          error: false,
          accessToken: token,
          user_info: payload.user,

        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, msg: "Server error." });
  }
};

//protected route handler for testing...
const protect = (req, res) => {
  return res.status(200).json({
    error: true,
    res: "This is proteted, can't access without token.",
    name: req.user.user_login,
  });
};

const verifyToken = (req, res) => {

  const { token } = req.body
  jwt.verify(token, process.env.JWTSECRET, (err, verifiedJwt) => {
    if (err) {
      return res.status(500).json({ valid: false })
    } else
      return res.status(200).json({ valid: true })
  }
  )
}

module.exports = { getAllUser, getUser, register, updateUser, login, protect, verifyToken };


// const thumbnail = req.files.thumbnail[0].filename;
//         const slider_image = req.files.slider_image;
//         console.log("slider", req.files.slider_image[0].filename)
//         let sliderImages = [];
//         for (image of slider_image){
//             const s_image = fullUrl + '/public/data/uploads/products' + image.filename;
//             sliderImages.push(s_image);
//         }
//         const thumbnailImage = fullUrl + '/public/data/uploads/products' + thumbnail;



    // if (!user_pass) {
    //   const password = generator.generate({
    //     length: 10,
    //     numbers: true
    //   });
    //   user_pass = password;
    //   console.log(password);
    // }
