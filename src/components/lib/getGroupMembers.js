import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
var nameGroup, urlImg;
const getGroupMembers = async (groupId) => {
  try {
    const groupRef = doc(db, "Groups", groupId);
    const groupSnapshot = await getDoc(groupRef);
    if (groupSnapshot.exists()) {
      const groupData = groupSnapshot.data();
      const members = groupData.members || [];
      nameGroup = groupData.nameGroup;
      urlImg = groupData.urlImg;
      
      const memberObjects = [];

      const memberPromises = members.map(async (memberId) => {
        const userRef = doc(db, "users", memberId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const { displayName, id, photoURL } = userData;

          memberObjects.push({ displayName, id, photoURL });
        }
      });

      await Promise.all(memberPromises);

      return memberObjects;
    } else {
      console.log("Group does not exist.");
      return []; // Trả về mảng rỗng nếu không tìm thấy nhóm
    }
  } catch (error) {
    console.error("Error getting group members:", error);
    return []; // Trả về mảng rỗng nếu xảy ra lỗi
  }
};
export{nameGroup, urlImg};
export default getGroupMembers;