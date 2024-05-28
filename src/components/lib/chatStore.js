// Trong useChatStore.js
import { create } from 'zustand';
import { doc, getDoc, updateDoc,onSnapshot } from "firebase/firestore";
import { db } from './firebaseConfig';
import { useUserStore } from '../lib/userStore'

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentBlocked: false,
  isReceiverBlocked: false,

  listenBlockedUsers: () => {
    const currentUser = useUserStore.getState().currentUser;
    const blockedUsersRef = doc(db, 'users', currentUser.id);
  
    return onSnapshot(blockedUsersRef, (doc) => {
      const data = doc.data();
      if (data) {
        set({ blockedUsers: data.blocked || [] });
      }
    });
  },
  
  changeChat: async (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    // Kiểm tra nếu người dùng hiện tại hoặc người nhận đã bị chặn
    if (user.blocked.includes(currentUser.id)) {
      alert('Bạn bị chặn, không thể nhắn tin!');
      return;
    } else if (currentUser.blocked.includes(user.id)) {
      alert('Bạn đã chặn người dùng này, không thể nhắn tin!');
      return;
    }

    // Nếu không có trường hợp chặn, thay đổi chat như bình thường
    set({
      chatId: chatId,
      user: user,
      isCurrentBlocked: false,
      isReceiverBlocked: false,
    });
  },

  changeBlock: () => {
    set(state => ({...state, isReceiverBlocked:!state.isReceiverBlocked}))
  },

  blockUser: async (userId, callback) => { // Thêm callback vào hàm blockUser
    try {
      const currentUser = useUserStore.getState().currentUser;
      const userRef = doc(db, 'users', currentUser.id);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const blockedUsers = [...currentUser.blocked, userId];
        await updateDoc(userRef, { blocked: blockedUsers });
        if (userId === useChatStore.getState().user.id) {
          set({ isReceiverBlocked: true });
        }
        callback(true); // Gọi callback và truyền true khi chặn thành công
      }
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  },
  
  unblockUser: async (userId, callback) => { // Thêm callback vào hàm unblockUser
    try {
      const currentUser = useUserStore.getState().currentUser;
      const userRef = doc(db, 'users', currentUser.id);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const blockedUsers = currentUser.blocked.filter(id => id !== userId);
        await updateDoc(userRef, { blocked: blockedUsers });
        set({ isReceiverBlocked: false });
        callback(false); // Gọi callback và truyền false khi gỡ chặn thành công
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  }
}))
