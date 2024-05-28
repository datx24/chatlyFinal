import { collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
// Lấy reference đến bộ sưu tập "Groups"
const groupRef = collection(db, "Groups");

// Cập nhật trường nameGroup của tài liệu có GroupID cho trước
async function updateNameGroup(GroupID, newGroupName) {
    try {
        // Tìm tài liệu có GroupID phù hợp
        const groupSnapshot = await getDocs(
          query(groupRef, where("GroupId", "==", GroupID))
        );
    
        if (!groupSnapshot.empty) {
          // Cập nhật trường nameGroup của tài liệu đó
          await updateDoc(groupSnapshot.docs[0].ref, { nameGroup: newGroupName });
          console.log("Đã cập nhật tên nhóm thành công!");
        } else {
          console.log("Không tìm thấy tài liệu có GroupID phù hợp.");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật tên nhóm:", error);
      }
}

export default updateNameGroup;