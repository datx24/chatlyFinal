import { db } from "./firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const addMembersToGroup = async (groupId, members) => {
  try {
    const groupRef = doc(db, "Groups", groupId);
    await updateDoc(groupRef, {
      members: arrayUnion(...members)
    });

    console.log("Members added to the group successfully.");
  } catch (error) {
    console.error("Error adding members to the group:", error);
  }
};
export default addMembersToGroup;
// Sử dụng hàm addMembersToGroup với groupId và danh sách thành viên cụ thể
