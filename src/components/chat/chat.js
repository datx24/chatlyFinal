import '../chat/chat.css';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useState, useRef, useContext } from 'react';
import AddUser from '../addUser/addUser';
import { arrayUnion, doc, onSnapshot, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { useChatStore } from '../lib/chatStore';
import { useUserStore } from '../lib/userStore';
import upload from '../lib/upload';
import moment from 'moment';
import { serverTimestamp } from 'firebase/firestore';
import GroupInfo from '../Modals/GroupInfo';
import { getStorage, ref, uploadBytes,getDownloadURL } from 'firebase/storage';
import { isChatVisible, toggleChatVisibility } from '../list/chatList/chatList'; // Đảm bảo đường dẫn đến file chatList.js là chính xác
import { showNotification } from '../chat/notification/notification';
import Search from '../../images/bx-search-alt.svg.png'
import UserPlus from "../../images/bx-user-plus.svg.png"
import Phone from "../../images/bx-phone-call.svg.png"
import Setting from "../../images/bx-cog.svg.png"
import File from "../../images/Gửi file.png"
import Voice from "../../images/Gửi voice.png"
import Picture from "../../images/video.png"
import Emoji from "../../images/Gửi emoji.png"
import Send from "../../images/Gửi tin nhắn.png"
import Share from "../../images/Vector.png"
import { IsUserContext } from '../lib/IsUserContext';
import { SelectedGroupContext } from '../ChatRoom/SelectedGroupContext';
const Chat = () => {
  const {isUser} = useContext(IsUserContext);
  const {selectedGroup} = useContext(SelectedGroupContext);
  const [isGroupInfoVisible, setIsGroupInfoVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chat, setChat] = useState(null); // Initialize with null
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [addMode, setAddMode] = useState(false);
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [images, setImages] = useState([]); // Add this state to store multiple images
  const [latestTextMessage, setLatestTextMessage] = useState(null); // State để lưu trữ tin nhắn văn bản mới nhất
  const storage = getStorage();
  const [messages, setMessages] = useState([]);
  const [showMessageSearch, setShowMessageSearch] = useState(false); // State to control the display of message search
  const [currentIndex, setCurrentIndex] = useState(0); // State to keep track of the current search result index
  const messageRefs = useRef([]); // Create a ref array to store references to message elements
  // Thêm state mới để lưu vị trí của tin nhắn được tìm thấy
  const [foundMessageIndex, setFoundMessageIndex] = useState(-1);
  const [foundMessage, setFoundMessage] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [replyContent, setReplyContent] = useState(null);
  const [replyText, setReplyText] = useState(""); // State cho nội dung tin nhắn reply
  const [replyMessageIndex, setReplyMessageIndex] = useState(-1);
  const [recording, setRecording] = useState(false); // State để theo dõi trạng thái ghi âm
  const mediaRecorder = useRef(null); // Ref để lưu trữ MediaRecorder instance
  const chunks = useRef([]); // Ref để lưu trữ các phần dữ liệu ghi âm
  const [audioUrl, setAudioUrl] = useState(null);

  const handleBlockClick = () => {
    toggleChatVisibility();
  };

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(
        doc(db, "chats", chatId),
        (res) => {
          setChat(res.data());
        }
      );
      return () => {
        unSub();
      };
    }
  }, [chatId]); // Only run the effect when chatId changes

  const toggleForm = () => {
    setAddMode(!addMode);
  };

  const imgStyles = {
    cursor: 'pointer'
  };

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = async (e) => {
    try {
      if (e.target.files[0]) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${e.target.files[0].name}`);
        await uploadBytes(storageRef, e.target.files[0]);
        const imgUrl = await getDownloadURL(storageRef);
  
        // Update the images state with the new image
        setImages((prevImages) => [
          ...prevImages,
          { file: e.target.files[0], url: imgUrl }
        ]);
  
        // Add the image URL to Firestore immediately
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            img: imgUrl,
            createdAt: serverTimestamp(),
          }),
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  
  
  
  const handleSend = async () => {
    try {
      
      const updatedMessages = [...messages];
  
      // Kiểm tra và thêm tin nhắn trả lời nếu có
      if (replyMessageIndex !== -1 && replyText.trim() !== '') {
        const replyTo = replyContent && replyContent.id ? replyContent.id : null;
        updatedMessages.push({
          senderId: currentUser.id,
          text: replyText.trim(),
          createdAt: Timestamp.now(),
          replyTo: replyTo,
        });
      }
  
      // Kiểm tra và thêm tin nhắn văn bản nếu có
      if (text.trim() !== '') {
        updatedMessages.push({
          senderId: currentUser.id,
          text: text.trim(),
          createdAt: Timestamp.now(),
        });
      }
  
      // Kiểm tra và thêm tin nhắn audio nếu có
      if (audioUrl) {
        updatedMessages.push({
          senderId: currentUser.id,
          audio: audioUrl,
          createdAt: Timestamp.now(),
        });
      }
  
      // Kiểm tra và thêm tin nhắn hình ảnh nếu có
      if (images.length > 0) {
        for (const image of images) {
          if (image && image.url) {
            updatedMessages.push({
              senderId: currentUser.id,
              img: image.url,
              createdAt: Timestamp.now(),
            });
          }
        }
      }
  
      // Cập nhật mảng tin nhắn của cả hai bên
      await updateDoc(doc(db, "chats", chatId), {
        messages: updatedMessages,
      });
  
      // Cập nhật mảng tin nhắn của người nhận
      const receiverId = 'receiver-id'; // Thay thế bằng ID của người nhận
      await updateDoc(doc(db, "chats", `${receiverId}-${currentUser.id}`), {
        messages: updatedMessages,
      });
  
      // Xóa các trường nhập liệu sau khi gửi
      setText("");
      setReplyText(""); // Đặt lại replyText sau khi gửi
      setReplyMessageIndex(-1); // Đặt lại replyMessageIndex sau khi gửi
      setImages([]);
      setSelectedFile(null);
      setReplyContent(null);
      setAudioUrl(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  
  const handleHideGroupInfo = () => {
    setShowGroupInfo(false);
  };

  const handleShowGroupInfo = () => {
    setIsGroupInfoVisible(!isGroupInfoVisible);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'chats', chatId), (snapshot) => {
      setMessages(snapshot.data()?.messages || []);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    const filteredMessages = messages.filter(message =>
      message.text && message.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredMessages);
  }, [messages, searchQuery]);

  const handleSearch = (e) => {
  const query = e.target.value;
  setSearchQuery(query);

  // Lọc tin nhắn ngay lập tức dựa trên query
  const filteredMessages = messages.filter(message =>
    message.text && message.text.toLowerCase().includes(query.toLowerCase())
  );
  setSearchResults(filteredMessages);
  setCurrentIndex(0);

  // Hiển thị tin nhắn đầu tiên tìm thấy nếu có
  if (filteredMessages.length > 0) {
    setFoundMessage(filteredMessages[0]);
  }
};

  

  const handleSearchClick = () => {
    setShowMessageSearch(true);
    setCurrentIndex(0);
  
    const foundMessage = searchResults.find(message =>
      message.text && message.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    if (foundMessage) {
      setFoundMessage(foundMessage);
      setCurrentIndex(searchResults.indexOf(foundMessage));
    }
  };
  
  useEffect(() => {
    // Reset showMessageSearch when search query changes
    setShowMessageSearch(false);
  }, [searchQuery]);

  // Function to handle moving to the next search result
  const handleNext = () => {
    if (currentIndex < searchResults.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const nextMessage = searchResults[currentIndex + 1];
      setFoundMessage(nextMessage);
    }
  };

  // Function to handle moving to the previous search result
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const previousMessage = searchResults[currentIndex - 1];
      setFoundMessage(previousMessage);
    }
  };
  
  useEffect(() => {
    if (showMessageSearch && foundMessage) {
      const foundIndex = messages.findIndex(message => message === foundMessage);
      if (foundIndex !== -1 && messageRefs.current[foundIndex]) {
        messageRefs.current[foundIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  
        // Add highlight class to the current message
        messageRefs.current[foundIndex].classList.add('highlight');
  
        // Remove highlight class after a delay
        setTimeout(() => {
          messageRefs.current[foundIndex].classList.remove('highlight');
        }, 2000);
      }
    }
  }, [foundMessage, showMessageSearch]);
  
  // Khi searchQuery thay đổi, cập nhật state của tin nhắn được tìm thấy và kiểm tra xem có cần hiển thị giao diện không
useEffect(() => {
  if (searchQuery.trim() === '') {
    // Nếu không có ký tự nào được nhập vào thanh tìm kiếm, ẩn giao diện tin nhắn tìm được
    setShowMessageSearch(false);
    setFoundMessage(null);
  } else if (searchResults.length > 0) {
    // Hiển thị kết quả tìm kiếm nếu có kết quả và có ký tự được nhập vào thanh tìm kiếm
    setShowMessageSearch(true);
    setFoundMessage(searchResults[0]); // Hiển thị tin nhắn đầu tiên trong kết quả tìm kiếm
  }
}, [searchQuery, searchResults]);

// Trong phần xử lý hiển thị thông báo tin nhắn mới nhất
if (chat && chat.lastMessage) {
  showNotification(chat.lastMessage, moment(chat.createdAt.toDate()).format('HH:mm, DD/MM/YYYY'));
}

useEffect(() => {
  // Check if there are messages and display the notification with the latest message
  if (messages.length > 0) {
    const latestMessage = messages[messages.length - 1]; // Get the latest message
    
    // If the current user is the sender, do not show the notification
    if (latestMessage.senderId !== currentUser.id) {
      let senderName = user.displayName; // If the current user received the message, use other user's display name
      const timestamp = moment(latestMessage.createdAt.toDate()).format('HH:mm, DD/MM/YYYY'); // Format the timestamp

      // Combine sender's name, message text, and timestamp for notification message
      let notificationMessage = "";
      if (latestMessage.text) {
        notificationMessage = `${senderName}: ${latestMessage.text} - ${timestamp}`;
      } else if (latestMessage.img) {
        notificationMessage = `${senderName}: đã gửi một ảnh - ${timestamp}`;
      }

      showNotification(notificationMessage); // Pass the notification message to showNotification
    }
  }
}, [messages]); // Run the effect whenever messages state changes

const handleFile = async (e) => {
  try {
    // Kiểm tra xem có tệp nào được chọn không
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Lấy tệp đầu tiên từ danh sách tệp được chọn
      const storageRef = ref(storage, `files/${file.name}`); // Tạo tham chiếu lưu trữ đến tệp trên Firebase Storage
      await uploadBytes(storageRef, file); // Tải tệp lên Firebase Storage
      const fileUrl = await getDownloadURL(storageRef); // Lấy URL của tệp đã tải lên

      // Cập nhật trạng thái của tệp được chọn
      setSelectedFile(file);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

const handleGroupInfoToggle = () => {
  setIsGroupInfoVisible(!isGroupInfoVisible);
};

const openFilePicker = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'; // Các định dạng tệp được chấp nhận
  input.onchange = (e) => handleFile(e); // Gọi hàm handleFile khi tập tin được chọn
  input.click(); // Kích hoạt sự kiện click trên phần tử input
};
console.log('this is ', isUser);
  return (
    <div className='chat'>
      <div className='body-child-right'>
        <div className="body-child-right-1">
          <div className='body-child-right-1-left'>
          {isUser ? <img src={selectedGroup.urlImg}/> : <img src={user?.photoURL} />}
            
          </div>
          <div className='body-child-right-1-nearleft'>
          {isUser ?  <span>{selectedGroup.nameGroup}</span> :  <span>{user?.displayName}</span>}
           
            {/* <p>4 người</p> */}
          </div>
          <div className='body-child-right-1-nearright'>
          <div className='input-wrapper'>
  <input placeholder='Tìm tin nhắn' onChange={handleSearch} value={searchQuery}/>
  <img onClick={handleSearchClick} src={Search} />
</div>
{/* // Trong giao diện, hiển thị tin nhắn được tìm thấy nếu showMessageSearch là true và foundMessage tồn tại */}
{showMessageSearch && foundMessage && (
  <div className='message-search-container'>
    <div className='message-search'>
      <div className='message-search left'>
        <span>{foundMessage.text}</span>
        <span>{moment(foundMessage.createdAt.toDate()).format('HH:mm, DD/MM/YYYY')}</span>
      </div>
      {/* Nút để điều hướng tới tin nhắn tiếp theo hoặc trước đó */}
      <div className='message-search right'>
        <i onClick={handleNext} className='bx bx-chevron-down'></i>
        <p>{currentIndex + 1}/{searchResults.length}</p>
        <i onClick={handlePrevious} className='bx bx-chevron-up'></i>
      </div>
    </div>
  </div>
)}

      </div>
          <div className='body-child-right-1-right'>
            <div className='body-child-right-1-right-1'>
            {isUser ?  
                <img src={UserPlus}
                onClick={toggleForm}
                style={imgStyles}
                /> :  <span></span>
                }
              
              {addMode && <AddUser />}
            </div>
            <div className='body-child-right-1-right-1'>
              <img src={Phone} />
            </div>
            <div className='body-child-right-1-right-1'>
            {isUser ? 
              <img src={Setting}
                onClick={handleShowGroupInfo} /> 
              : 
              <img src={Setting}
                onClick={()=>{}}/>  
            }
            {/* ------------------------------------- */}

            {isGroupInfoVisible && <GroupInfo onClose={handleGroupInfoToggle}/>}
            </div>
          </div>
        </div>
        <div className="body-child-right-2">
          {/* Display the latest text message */}
          {latestTextMessage && (
            <div className={latestTextMessage.senderId === currentUser.id ? 'Message own' : 'Message'}>
              <div className='texts'>
                <p>{latestTextMessage.text}</p>
                {/* Display the timestamp */}
                {latestTextMessage.createdAt && latestTextMessage.createdAt instanceof Timestamp ? (
                  <span>{moment(latestTextMessage.createdAt.toDate()).format('HH:mm, DD/MM/YYYY')}</span>
                ) : (
                  <span>No timestamp available</span>
                )}
              </div>
            </div>
          )}

{chat?.messages?.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()).map((message, index) => (
  <div className={message.senderId === currentUser.id ? 'Message own' : 'Message'} key={index} ref={(el) => (messageRefs.current[index] = el)}>
    {message.senderId !== currentUser.id && <img src={user.photoURL} alt="Avatar" />}
    <div className='texts'>
      {message.text && !message.img && !message.file && (
        <div className="message-text-wrapper">
          {message.senderId === currentUser.id && <i className='bx bxs-share share-icon left'></i>}
          <p>{message.text}</p>
          {message.senderId !== currentUser.id && <i className='bx bxs-share bx-flip-horizontal share-icon right'></i>}
        </div>
      )}
      {message.img && !message.text && !message.file && <img src={message.img} alt={`image-${index}`} />}
      {message.file && !message.text && !message.img && (
        <div>
          <p><a href={message.file} download={message.fileName}>{message.fileName}</a></p>
        </div>
      )}
      {message.text && message.img && (
        <div>
          {index === 0 || (index > 0 && chat.messages[index - 1].senderId !== currentUser.id && !chat.messages[index - 1].img) && <p>{message.text}</p>}
          <img src={message.img} alt={`image-${index}`} />
        </div>
      )}
      {message.createdAt && message.createdAt instanceof Timestamp ? (
        <span>{moment(message.createdAt.toDate()).format('HH:mm, DD/MM/YYYY')}</span>
      ) : (
        <span>No timestamp available</span>
      )}
    </div>
  </div>
))}

        </div>
        {isBlocked ? (
  <div className="block-message">Bạn đã chặn người dùng này, không thể nhắn tin!</div>
) : (
  <div className="body-child-right-3">
    <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
    <img src={File} onClick={openFilePicker}/>
    <img src={Voice} />
    {/* // Thêm sự kiện click vào label để kích hoạt input file */}
    <label className='button_upImg' htmlFor='file' onClick={(e) => e.stopPropagation()}>
      <img src={Picture}/>
    </label>
    <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
  </div>
)}
<div className="body-child-right-4">
  <div className='input-wrapper'>
    <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
    {/* Hiển thị hình ảnh đã chọn trước khi gửi */}
    {images.length > 0 && (
      <div className="selected-images">
        {images.map((image, index) => (
          <img key={index} src={URL.createObjectURL(image.file)} alt={`selected-image-${index}`} />
        ))}
      </div>
    )}
    <input onKeyPress={handleKeyPress} placeholder='Aa' onChange={(e) => setText(e.target.value)} value={text} />
    <div className='emoji'>
      <img src={Emoji}
        onClick={() => setOpen((prev) =>!prev)}
      />
      <div className='picker'>
        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
      </div>
    </div>
    <img src={Send}
      onClick={handleSend}
    />
  </div>
</div>
{selectedFile && <p className='selected-file-name'>{selectedFile.name}</p>}
      </div>
    </div>
  );
};

export default Chat;