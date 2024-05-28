import { db } from "./firebaseConfig";
import { doc, getDoc, updateDoc  } from "firebase/firestore";
// Hàm xóa thành viên khỏi nhóm
async function deleteMember(groupId, memberId) {
  try {
    // Truy cập vào document nhóm cần cập nhật
    const groupRef = doc(db, "Groups", groupId);
    // Lấy document nhóm
    const groupSnapshot = await getDoc(groupRef);
    if (groupSnapshot.exists()) {
      // Lấy danh sách thành viên hiện tại
      const members = groupSnapshot.data().members;

      // Xóa thành viên khỏi danh sách
      const updatedMembers = members.filter(member => member !== memberId);

      // Cập nhật lại danh sách thành viên
      await updateDoc(groupRef, { members: updatedMembers });
      console.log('Thành viên đã được xóa khỏi nhóm.');
    } else {
      console.log('Không tìm thấy nhóm với ID:', groupId);
    }
  } catch (error) {
    console.error('Lỗi khi xóa thành viên khỏi nhóm:', error);
  }
}

export default  deleteMember;