//include all dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { Op } = require("sequelize");
const { getMatchedValue } = require("../helpers/MatchPermission");
const { UserExtention, User } = require("../utils/DB");


const getAllUser = async (req, res) => {
  try {
    // const limit = parseInt(req.params.limit);
    // const offset = parseInt(req.params.offset);

    const users = await User.findAll({
      attributes: [
        "id",
        "user_login",
        "user_email",
        "user_registered",
        "display_name",
      ],

      include: [
        {
          model: UserExtention,
          attributes: ["user_id", ["meta_value", "role"]],
          where: {
            meta_key: "bden_capabilities",
          },
        },
      ],
      order: [["id", "DESC"]],
    });

    let userData = [];
    for (let index = 0; index < users.length; index++) {
      let user = users[index];
      let role = getMatchedValue(
        users[index].dataValues.bden_UserExtention[0].dataValues.role,
        roles
      );
      user.dataValues.bden_UserExtention[0].dataValues.role = role;
      userData.push(user);
    }

    return res.status(200).json({ error: false, userList: userData });
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
        "user_login",
        "user_email",
        "user_registered",
        "display_name",
      ],

    });

    const userMata_info = await UserExtention.findAll();

    let userMata_info_arr = {};


    for await (info of userMata_info) {
      userMata_info_arr[info.meta_key] = info.meta_value;
    }

    console.log('userMata_info_arr', userMata_info_arr)

    return res.status(200).json({ error: false, user: user, user_info: userMata_info_arr });
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
      meta_value,
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
      user_pass,
      user_email,
      user_url,
      user_nicename,
      first_name,
      nickname,
      last_name,
      description,
      bden_capabilities,
      role,
      avatar,
      meta_value,
      phone,
      address,
      dob,
      facebook_link,
      twitter_username,

    } = req.body;

    if (
      user_nicename == "" ||
      user_nicename == null ||
      user_nicename == undefined
    ) {
      return res
        .status(200)
        .json({ error: true, msg: "Nickname is requrired." });
    }
    if (user_email == "" || user_email == null || user_email == undefined) {
      return res.status(200).json({ error: true, msg: "Email is requrired." });
    }
    if (user_pass) {
      user_password = bcrypt.hashSync(user_pass, 12, (err, hash) => {
        if (err) {
          throw err;
        }
        return hash;
      });
    }

    if (req.body.user_email !== old_user.user_email) {
      user_mail = await User.findOne({ where: { user_email: user_email } });
      if (user_mail) {
        return res
          .status(400)
          .json({ error: true, msg: "E-mail already taken" });
      }
    }

    old_user.user_nicename = user_nicename;
    if (user_pass) {
      old_user.user_pass = user_password;
    }
    old_user.user_email = user_email;

    if (first_name || last_name) {
      old_user.display_name = first_name + " " + last_name;
    }
    old_user.user_url = user_url;

    await old_user.save();

    console.log("old_user", old_user.user_nicename);

    let nicknameinfo = await UserExtention.findOne({
      where: { meta_key: "nickname", user_id: userid },
    });
    nicknameinfo.meta_value = old_user.user_nicename;
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
    if (description) {
      let descriptioninfo = await UserExtention.findOne({
        where: { meta_key: "description", user_id: userid },
      });
      descriptioninfo.meta_value = description;
      descriptioninfo.save();
    }

    if (bden_capabilities) {
      let bden_capabilitiesinfo = await UserExtention.findOne({
        where: { meta_key: "bden_capabilities", user_id: userid },
      });
      bden_capabilitiesinfo.meta_value = bden_capabilities;
      bden_capabilitiesinfo.save();
    }

    if (req.file) {
      console.log(req.file);
      let avatarinfo = await UserExtention.findOne({
        where: { meta_key: "avatar", user_id: userid },
      });
      avatarinfo.meta_value = req.file.filename;
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


    if (facebook_link) {
      let facebook_linkinfo = await UserExtention.findOne({
        where: { meta_key: "facebook_link", user_id: userid },
      });
      facebook_linkinfo.meta_value = facebook_link;
      facebook_linkinfo.save();
    }

    if (twitter_username) {
      let twitter_usernameinfo = await UserExtention.findOne({
        where: { meta_key: "twitter_username", user_id: userid },
      });
      twitter_usernameinfo.meta_value = twitter_username;
      twitter_usernameinfo.save();
    }


    return res.status(200).json({
      error: false,
      //data: updateUser,
      msg: "Profile updated successfully.",
    });
  } catch (err) {
    console.log(err);
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
    jwt.sign( payload, process.env.JWTSECRET, { expiresIn: "24h" }, { algorithm: 'RS256' },
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



    // if (!user_pass) {
    //   const password = generator.generate({
    //     length: 10,
    //     numbers: true
    //   });
    //   user_pass = password;
    //   console.log(password);
    // }
