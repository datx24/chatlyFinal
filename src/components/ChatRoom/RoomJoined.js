import React from 'react'
import { db } from "../lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";


 const roomJoined = async (userId) => {
    const joinedGroupIds = [];
    try {
      const groupsRef = collection(db, "Groups");
      const q = query(groupsRef, where("members", "array-contains", userId));
      const querySnapshot = await getDocs(q);
  
     
      querySnapshot.forEach((doc) => {
        joinedGroupIds.push(doc.id);
      });
  
    //    console.log("Joined Group IDs:", typeof(joinedGroupIds));
    } catch (error) {
      console.error("Error getting joined group IDs:", error);
    }
    return joinedGroupIds;
  };
  
  export default roomJoined;
  // // Sử dụng hàm getJoinedGroupIds với user ID cụ thể
  // const userId = "TjcA6ZnPaQOKMGeEiLbPtJtnEhy1";
  // getJoinedGroupIds(userId);