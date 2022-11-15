import database from '@react-native-firebase/database';

export const AddUser = async (name, email, image, uid) => {
  console.log('Add user');
  try {
    return database()
      .ref('users/' + uid)
      .set({
        name: name,
        email: email,
        image: image,
        uuid: uid,
      });
  } catch (error) {
    return error;
  }
};

export const UpdateUserImage = async (image, uid) => {
  console.log('uid on update user',uid);
  try {
    return database()
      .ref('users/' + uid)
      .update({
        image: image,
      });
  } catch (error) {
    return error;
  }
};
