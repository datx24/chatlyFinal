import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "./firebaseConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { useState } from "react";
const createGroup = async (nameGroup, file, members, leader) => {
  try {
    // 
    const storageRef = ref(storage, `images/${nameGroup}.png`);
  
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Lấy URL tải xuống của ảnh
    const snapshot = await uploadTask;
    const url = await getDownloadURL(snapshot.ref);
    
    // Lưu thông tin nhóm vào Firestore
    const groupRef = collection(db, "Groups");
    const newGroupDoc = await addDoc(groupRef, {
      nameGroup,
      urlImg: url, // Lưu link ảnh vào trường urlImg
      GroupId: "", // Trường GroupId được khởi tạo rỗng
      members,
      leader
    });
    
    // Gán giá trị newGroupDoc.id cho trường GroupId
    const groupId = newGroupDoc.id;
    await updateDoc(doc(db, "Groups", newGroupDoc.id), { GroupId: groupId });
    
    console.log("Group created successfully.");
    
  } catch (error) {
    console.error("Error creating group:", error);
  }
};
export default createGroup;