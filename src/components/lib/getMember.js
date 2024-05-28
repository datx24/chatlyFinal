import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const fetchMemberData = async (MemberId) => {
  try {
    const memberRef = doc(db, "users", MemberId);
    const memberSnapSot = await getDoc(memberRef);
    if (memberSnapSot.exists()) {
      const memberData = memberSnapSot.data();
      const memberName = memberData.displayName;
      //console.log(memberName) // Lấy trường "name" từ dữ liệu thành viên
      return memberName;
    } else {
      console.log("Member does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error getting member data:", error);
    return null;
  }
};

export default fetchMemberData;