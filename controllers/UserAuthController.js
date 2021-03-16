//include all dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { Op } = require("sequelize");
const { getMatchedValue } = require("../helpers/MatchPermission");
const { UserExtention, User } = require("../utils/DB");

//handler for register user....

const getAllUser = async (req, res) => {
  try {
    // const limit = parseInt(req.params.limit);
    // const offset = parseInt(req.params.offset);

    const users = await User.findAll({
      attributes: [
        "ID",
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
      order: [["ID", "DESC"]],
    });

    let userData = [];
    for (let index = 0; index < users.length; index++) {
      let user = users[index];
      let role = getMatchedValue(
        users[index].dataValues.bden_usermeta[0].dataValues.role,
        roles
      );
      user.dataValues.bden_usermeta[0].dataValues.role = role;
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
    const userId = req.params.ID;
    const user = await User.findOne({
      where: { ID: userId },
      attributes: [
        "ID",
        "user_login",
        "user_email",
        "user_registered",
        "display_name",
      ],

    });

    const userMata_info = await UserMeta.findAll();

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
    user_login,
    user_email,
    user_pass,
    user_url,
    first_name,
    last_name,
    role,
    avatar,

  } = req.body;

  try {
    //checking email taken or not...
    let user = await User.findOne({ where: { user_email: user_email } });
    if (user) {
      return res.status(400).json({ error: true, msg: "E-mail already taken" });
    }
    let username = await User.findOne({ where: { user_login: user_login } });
    if (username) {
      return res
        .status(400)
        .json({ error: true, msg: "Username already taken" });
    }

    user_registered_date = moment().format("YYYY-MM-DD h:mm:ss");

    // if (!user_pass) {
    //   const password = generator.generate({
    //     length: 10,
    //     numbers: true
    //   });
    //   user_pass = password;
    //   console.log(password);
    // }

    user_pass = bcrypt.hashSync(user_pass, 12, (err, hash) => {
      if (err) {
        throw err;
      }
      return hash;
    });
    //user create with credentials...
    const newUser = await User.create({
      user_login,
      user_pass: user_pass,
      user_nicename: user_login,
      user_email,
      user_url,
      user_registered: user_registered_date,
      display_name: first_name + " " + last_name,
    });

    let meta_key_0 = "nickname";
    await UserMeta.create({
      user_id: newUser.ID,
      meta_key: meta_key_0,
      meta_value: newUser.user_nicename,
    });

    let meta_key_1 = "first_name";
    await UserMeta.create({
      user_id: newUser.ID,
      meta_key: meta_key_1,
      meta_value: first_name,
    });

    let meta_key_2 = "last_name";
    await UserMeta.create({
      user_id: newUser.ID,
      meta_key: meta_key_2,
      meta_value: last_name,
    });

    let meta_key_3 = "description";
    await UserMeta.create({
      user_id: newUser.ID,
      meta_key: meta_key_3,
      meta_value,
    });

    let bden_capabilities = "subscriber";
    if (role) {
      bden_capabilities = role;
    }
    let meta_key_4 = "bden_capabilities";
    await UserMeta.create({
      user_id: newUser.ID,
      meta_key: meta_key_4,
      meta_value: bden_capabilities,
    });
    let meta_key_6 = "avatar";
    await UserMeta.create({
      user_id: newUser.ID,
      meta_key: meta_key_6,
      meta_value,
    });
    let meta_key_7 = "dob";
    await UserMeta.create({
      user_id: newUser.ID,
      meta_key: meta_key_7,
      meta_value,
    });
    let meta_key_8 = "address";
    await UserMeta.create({
      user_id: newUser.ID,
      meta_key: meta_key_8,
      meta_value,
    });

    let meta_key_10 = "designation";
    await UserMeta.create({
      user_id: newUser.ID,
      meta_key: meta_key_10,
      meta_value,
    });
    let meta_key_11 = "facebook_link";
    await UserMeta.create({
      user_id: newUser.ID,
      meta_key: meta_key_11,
      meta_value,
    });
    let meta_key_12 = "twitter_username";
    await UserMeta.create({
      user_id: newUser.ID,
      meta_key: meta_key_12,
      meta_value,
    });

    return res
      .status(201)
      .json({ error: false, msg: "User registerd Successfuly." });
  } catch (err) {
    //check for possible erros...
    console.log(err);
    res.status(500).json({ error: true, msg: "Server error." });
  }
};

const updateUser = async (req, res) => {
  try {
    console.log("data", req.body);

    const userId = req.params.ID;
    //const userMetaId = req.params.user_id ;
    let old_user = await User.findOne({ where: { ID: userId } });

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

    let nicknameinfo = await UserMeta.findOne({
      where: { meta_key: "nickname", user_id: userId },
    });
    nicknameinfo.meta_value = old_user.user_nicename;
    nicknameinfo.save();

    if (first_name) {
      let first_nameinfo = await UserMeta.findOne({
        where: { meta_key: "first_name", user_id: userId },
      });
      //console.log( 'first_nameinfo', first_nameinfo);
      if (first_nameinfo) {
        first_nameinfo.meta_value = first_name;
        first_nameinfo.save();
      }
    }

    if (last_name) {
      let last_nameinfo = await UserMeta.findOne({
        where: { meta_key: "last_name", user_id: userId },
      });
      last_nameinfo.meta_value = last_name;
      last_nameinfo.save();
    }
    if (description) {
      let descriptioninfo = await UserMeta.findOne({
        where: { meta_key: "description", user_id: userId },
      });
      descriptioninfo.meta_value = description;
      descriptioninfo.save();
    }

    if (bden_capabilities) {
      let bden_capabilitiesinfo = await UserMeta.findOne({
        where: { meta_key: "bden_capabilities", user_id: userId },
      });
      bden_capabilitiesinfo.meta_value = bden_capabilities;
      bden_capabilitiesinfo.save();
    }

    if (req.file) {
      console.log(req.file);
      let avatarinfo = await UserMeta.findOne({
        where: { meta_key: "avatar", user_id: userId },
      });
      avatarinfo.meta_value = req.file.filename;
      avatarinfo.save();
    }

    if (phone) {
      let phoneinfo = await UserMeta.findOne({
        where: { meta_key: "phone", user_id: userId },
      });
      phoneinfo.meta_value = phone;
      phoneinfo.save();
    }

    if (address) {
      let addressinfo = await UserMeta.findOne({
        where: { meta_key: "address", user_id: userId },
      });
      addressinfo.meta_value = address;
      addressinfo.save();
    }

    if (dob) {
      let dobinfo = await UserMeta.findOne({
        where: { meta_key: "dob", user_id: userId },
      });
      dobinfo.meta_value = dob;
      dobinfo.save();
    }


    if (facebook_link) {
      let facebook_linkinfo = await UserMeta.findOne({
        where: { meta_key: "facebook_link", user_id: userId },
      });
      facebook_linkinfo.meta_value = facebook_link;
      facebook_linkinfo.save();
    }

    if (twitter_username) {
      let twitter_usernameinfo = await UserMeta.findOne({
        where: { meta_key: "twitter_username", user_id: userId },
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
  const { user_pass, user_email } = req.body;

  try {
    //checking email registerd or not...
    const user = await User.findOne({ where: { user_email: user_email } });
    if (!user) {
      return res.status(400).json({ error: true, msg: "Invalid credentials." });
    }
    const userMeta = await UserMeta.findOne({
      where: { meta_key: "bden_capabilities", user_id: user.ID },
    });
    if (!userMeta) {
      return res.status(400).json({ error: true, msg: "Invalid credentials." });
    }

    //checking for password match..
    const isMatched = await bcrypt.compare(user_pass, user.user_pass);
    if (!isMatched) {
      return res.status(400).json({ error: true, msg: "Invalid credentials" });
    }

    //create and store refresh token into db...

    const payload = {
      user: {
        ID: user.ID,
        user_login: user.user_login,
        user_email: user.user_email,
        permission: userMeta.meta_value,
      },
    };

    console.log(payload);

    //let token = "";
    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) {
          throw err;
        }


        return res.status(200).json({
          error: false,
          accessToken: token,
          user_info: payload.user,

        });
      }
    );
  } catch (err) {
    //check for possible error...
    console.log(err);
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
