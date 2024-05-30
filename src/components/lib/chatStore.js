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
    //Kiểm tra nếu người gửi tin bị chặn
    if(user.blocked.includes(currentUser.id)){
      return set({
        chatId: chatId,
        user: null,
        isCurrentBlocked: false,
        isReceiverBlocked: true,
      });
    }
    //Kiểm tra nếu người nhận tin bị chặn
    if(currentUser.blocked.includes(user.id)){
      return set({
        chatId: chatId,
        user: user,
        isCurrentBlocked: true,
        isReceiverBlocked: false,
      });
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

}));


