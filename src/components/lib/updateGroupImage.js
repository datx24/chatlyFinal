import { collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import { db, storage } from "./firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Lấy reference đến bộ sưu tập "Groups"
const groupRef = collection(db, "Groups");

// Hàm upload ảnh lên Storage và cập nhật trường urlImg
async function updateGroupImage(GroupID, newImageFile) {
  try {
    // 1. Upload ảnh lên Storage
    const newImageUrl = await upload(newImageFile);

    // 2. Cập nhật trường urlImg trong Firestore
    const groupSnapshot = await getDocs(
      query(groupRef, where("GroupId", "==", GroupID))
    );

    if (!groupSnapshot.empty && groupSnapshot.docs.length > 0) {
      await updateDoc(groupSnapshot.docs[0].ref, { urlImg: newImageUrl });
      console.log("Đã cập nhật URL hình ảnh thành công!");
    } else {
      console.log("Không tìm thấy tài liệu có GroupID phù hợp.");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật hình ảnh:", error);
  }
}

// Hàm upload ảnh lên Storage
const upload = async (file) => {
  const date = new Date();
  const storageRef = ref(storage, `${date + file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, 
      (error) => {
        reject("Something went wrong!" + error.code);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL)
        });
      }
    );
  });
};

export default updateGroupImage;